#!/usr/bin/env node
/**
 * 一次性内容导出工具（维护者专用，需要作者本人的 Airtable 内容库 PAT）
 *
 * 把 IOTO 框架的全部内容包从 Airtable 内容库导出为本地文件，
 * 写入 content/ 目录。之后 git add content/ 提交，Airtable 退役，
 * 全部内容随仓库开源分发。
 *
 * 用法（只需一步——填上你的 PAT）：
 *   IOTO_PAT="pat你的token" node scripts/export-content.mjs
 *
 * 可选参数：
 *   IOTO_LANG=zh|en|tw   只导出单语言（默认三语言全导）
 *   IOTO_PACKS=core,help  只导出指定包（默认全部）
 *
 * 安全：PAT 只从环境变量读取，绝不写入任何文件、绝不提交进仓库。
 */

import { writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT = join(ROOT, "content");

const PAT = process.env.IOTO_PAT;
if (!PAT) {
	console.error("❌ 缺少环境变量 IOTO_PAT（Airtable Personal Access Token，需具备内容库读取权限）");
	console.error("   用法: IOTO_PAT=\"pat你的token\" node scripts/export-content.mjs");
	console.error("   在 https://airtable.com/create/tokens 新建，scope 勾选 data.records:read，");
	console.error("   base 范围勾选 IOTO 内容库（appq2MtxkPBdZc3Sc）即可。");
	process.exit(1);
}

// ─── 内容库配置（真实 ID，已从生产配置还原）──────────────────────────
// 主表 tbl4GESFGwmmC3b0X 承载 5 个内容包（各一个 view），帮助文档单独一张表。
const BASE = "appq2MtxkPBdZc3Sc";
const TABLES = {
	core: "tbl4GESFGwmmC3b0X",
	myioto: "tbl4GESFGwmmC3b0X",
	settingsPlugin: "tbl4GESFGwmmC3b0X",
	css: "tbl4GESFGwmmC3b0X",
	skills: "tbl4GESFGwmmC3b0X",
	help: "tblXcG6xRogRCBtvF",
};

// 每个 pack 对应的 view（与旧版 updateIDs 配置逐字对齐）
const VIEWS = {
	core: "viwJmaXwNSSQLWnlv",
	myioto: "viwwm0ECA7Qujdxbq",
	myiotoUpdatedOrNew: "viwaSOyGsIdBEJSzQ",
	settingsPlugin: "viwwopZSx1IGoTiJE",
	css: "viwRzFMRwcWbnE6Ly",
	skills: "viw47EB5KWORor3L5",
	help: "viwMj7QY47Avpz7u3",
};

// ─── 字段映射（与旧版 buildFieldNames 逐字对齐）──────────────────────
// 旧版运行时按用户语言取字段：zh-cn→Title/SubFolder/MD，en→TitleEN/…，tw→…TW
const LANG_FIELDS = {
	zh: { title: "Title", sub: "SubFolder", md: "MD" },
	en: { title: "TitleEN", sub: "SubFolderEN", md: "MDEN" },
	tw: { title: "TitleTW", sub: "SubFolderTW", md: "MDTW" },
};
const EXT_FIELD = "Extension";
const UPDATED_FIELD = "UpdatedIn";

// pack → 落盘目录（content/ 下的子目录名，与新插件 CONTENT_DIRS 对齐）
const PACK_TARGET = {
	core: "core",
	myioto: "myioto",
	myiotoUpdatedOrNew: "myioto", // 增量视图与全量视图同目录，后写覆盖
	settingsPlugin: "settings-plugin",
	css: "css",
	skills: "skills",
	help: "help",
};

// 旧版部署目标根与新插件的差异，导出时按包剥离 SubFolder 前缀，
// 保证 content/ 布局与新部署目标直接对应：
//   css:             旧 SubFolder "snippets/…" + 目标 .obsidian      → 新目标 .obsidian/snippets，剥 "snippets/"
//   settingsPlugin:  旧 SubFolder "plugins/ioto-settings…" + .obsidian → 新目标 …/plugins/ioto-settings，剥该前缀
const SUBFOLDER_STRIP = {
	css: /^snippets\/?/,
	settingsPlugin: /^plugins\/ioto-settings\/?/,
};

const LANGS = process.env.IOTO_LANG ? [process.env.IOTO_LANG] : ["zh", "en", "tw"];
const ONLY_PACKS = process.env.IOTO_PACKS
	? process.env.IOTO_PACKS.split(",").map((s) => s.trim()).filter(Boolean)
	: null;

// ─── Airtable 分页拉取 ─────────────────────────────────────────────
async function fetchAllRecords(tableId, viewId, fields) {
	const out = [];
	let offset = "";
	do {
		const params = new URLSearchParams({
			view: viewId,
			...(fields ? { fields: JSON.stringify(fields) } : {}),
			...(offset ? { offset } : {}),
		});
		const url = `https://api.airtable.com/v0/${BASE}/${tableId}?${params}`;
		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${PAT}` },
		});
		if (!res.ok) {
			throw new Error(`Airtable ${res.status}: ${(await res.text()).slice(0, 200)}`);
		}
		const data = await res.json();
		out.push(...(data.records || []));
		offset = data.offset || "";
	} while (offset);
	return out;
}

// ─── 语言选择：优先当前语言字段，缺失则回落 zh → en ──────────────────
function pickField(fieldsObj, langs, kind) {
	for (const lang of langs) {
		const f = LANG_FIELDS[lang][kind];
		const v = fieldsObj[f];
		if (typeof v === "string" && v.trim()) return { value: v, lang };
	}
	return null;
}

function sanitize(name) {
	return name
		.replace(/[\\/:*?"<>|]/g, "-")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, 120);
}

async function exportPack(pack) {
	const table = TABLES[PACK_TARGET[pack]] ?? TABLES[pack];
	const view = VIEWS[pack];
	const targetDir = join(CONTENT, PACK_TARGET[pack]);

	console.log(`\n📦 ${pack} → content/${PACK_TARGET[pack]}/   (view ${view.slice(0, 8)}…)`);

	const records = await fetchAllRecords(table, view);
	console.log(`   拉到 ${records.length} 条记录`);

	let n = 0;
	for (const r of records) {
		const f = r.fields || {};

		const title = pickField(f, LANGS, "title");
		const md = pickField(f, LANGS, "md");
		if (!title) continue; // 无标题记录跳过
		const sub = pickField(f, LANGS, "sub");
		const ext = ((Array.isArray(f[EXT_FIELD]) ? f[EXT_FIELD][0] : f[EXT_FIELD]) || "md")
			.replace(/^\./, "")
			.toLowerCase();

		// 旧版语义：SubFolder 是相对目标根的子路径；导出时按包剥离旧目标根前缀，
		// 使 content/<pack>/ 布局 == 新插件部署目标（避免 snippets/snippets/ 双层）
		let rel = sub ? sub.value.replace(/^\/+|\/+$/g, "") : "";
		const strip = SUBFOLDER_STRIP[pack];
		if (strip) rel = rel.replace(strip, "");
		const dir = rel ? join(targetDir, rel) : targetDir;
		mkdirSync(dir, { recursive: true });

		let fileBase = sanitize(title.value);
		// Title 字段可能自带扩展名（如 "xxx.md"），避免拼出 ".md.md" 双后缀
		if (new RegExp(`\\.${ext}$`, "i").test(fileBase)) {
			fileBase = fileBase.replace(new RegExp(`\\.${ext}$`, "i"), "");
		}
		// 多语言导出策略：zh 用原名，en/tw 加语言后缀，三语共存互不覆盖
		const suffix = title.lang === "zh" ? "" : `.${title.lang}`;
		const filePath = join(dir, `${fileBase}${suffix}.${ext}`);

		const body = md ? md.value : "";
		writeFileSync(filePath, body, "utf-8");
		n++;
		console.log(`   ✓ ${rel ? rel + "/" : ""}${fileBase}${suffix}.${ext}`);
	}
	console.log(`   ${pack}: 写入 ${n} 个文件`);
	return n;
}

// ─── 导出后的体检：列出 content/ 全貌 ───────────────────────────────
function summarize() {
	console.log("\n📊 content/ 目录全貌：");
	let total = 0;
	for (const pack of ["core", "myioto", "help", "css", "skills", "settings-plugin"]) {
		const dir = join(CONTENT, pack);
		if (!existsSync(dir)) { console.log(`   ${pack}: （空）`); continue; }
		const files = [];
		(function walk(d) {
			for (const name of readdirSync(d)) {
				const p = join(d, name);
				if (statSync(p).isDirectory()) walk(p);
				else if (name !== ".gitkeep") files.push(p);
			}
		})(dir);
		total += files.length;
		console.log(`   ${pack}: ${files.length} 个文件`);
	}
	console.log(`   合计: ${total} 个文件`);
}

async function main() {
	const packs = ONLY_PACKS || ["core", "myioto", "myiotoUpdatedOrNew", "help", "css", "settingsPlugin", "skills"];
	let grand = 0;
	for (const pack of packs) {
		if (!(pack in VIEWS)) {
			console.warn(`⚠️ 未知包 ${pack}，跳过（可用：${Object.keys(VIEWS).join(", ")}）`);
			continue;
		}
		try {
			grand += await exportPack(pack);
		} catch (e) {
			console.error(`   ⚠️ ${pack} 失败: ${e.message}`);
			console.error(`      请确认 PAT 具备内容库 ${BASE} 的 data.records:read 权限`);
		}
	}
	summarize();
	console.log(`\n✅ 导出完成，共 ${grand} 个文件。`);
	console.log("   下一步：");
	console.log("   1) 检查 content/ 内容（重点：css/ 里的子目录应为 snippets/…、settings-plugin/ 应为插件三件套所在目录结构）");
	console.log("   2) git add content/ && git commit -m \"feat: bundle all IOTO content\" && git push");
	console.log("   3) 在 Airtable 后台 revoke 本次用的 PAT，并归档内容库");
}

main().catch((e) => {
	console.error("导出失败:", e);
	process.exit(1);
});
