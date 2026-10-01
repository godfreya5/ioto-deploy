<%*
/**
** 这是IOTO辅助工具-移除要点的Templater脚本
** 功能：将当前笔记中的所有 * = _ 替换为空
**/

let content = tp.file.content;
content = content.replace(/[\*\=_]/g, "");
await app.vault.modify(tp.config.active_file, content);

_%>