---
Advanced: true
ForOBSync: true
OpenArticle: false
Pro: true
Product: IOTO
Project: 
 - IOTO-V2
dateCreated: 2026-07-30 09-20-26
dateModified: 2026-07-30 09-21-04
---
# 手把手教你如何配置 IOTO 与 Vika 的基本同步

Vika（维格表）是一款轻量的多维表格工具。相比飞书多维表，它在「单品」定位上更简单，而它的同步配置，也是目前所有多维表产品里最简单的——这正是它适合作为 IOTO 数据同步入门选择的原因。

本教程面向第一次使用 IOTO 同步功能的用户，带你从零完成 IOTO 与 Vika 的基本同步配置。跟着下面的 5 个步骤操作即可，每一步都配有截图。

> [!info] 开始前你需要准备
> - 一个可用的 [Vika 账号](https://vika.cn)（注册免费）。
> - 一个已经安装并启用了 **IOTO Framework Settings** 插件的 Obsidian 库。

---

## 配置流程

### 第一步：进入 Vika 同步配置页面，打开同步模板

在你的 Obsidian 库中，打开 **设置 → 第三方插件**，找到并点击 `IOTO Framework Settings` 插件。

进入插件设置页后，点击 **同步和获取**，再点击下方 tab 栏里的 **Vika**，最后点击 **Vika 同步模板** 这个链接。

> [!tip] 直接进入模板
> 如果你不方便在插件里点击，也可以直接用下面的分享链接打开官方同步模板：
> https://vika.cn/share/shrA7CmfUTt5XU020Lv32/dstYx8rm2zifjJ7Jro/viw7rCaR8ZeJW

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105422.png)

### 第二步：把模板另存到你的空间站

打开模板后，点击页面 **左下角的「另存」按钮**，把它保存到你自己的空间。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105521.png)

如果还没登录，Vika 会先提示你登录。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105539.png)

登录后，在弹出的窗口中 **选择你的空间站**。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105649.png)

保存成功后，你会在自己的空间站里看到一张全新的数据表。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105757.png)

### 第三步：拿到 Table ID，填回 IOTO 设置

接下来要复制这张表的 **Table ID**。

在 Vika 的地址栏里，Table ID 就是 URL 中 `workbench/` 和其后下一个 `/` 之间的那段内容。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105817.png)

回到 Obsidian 的 **Vika 同步设置页**，把你复制到的 Table ID 粘贴到对应的设置框里。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105846.png)

### 第四步：获取你的 API Key

回到 Vika 页面，点击 **左下角的头像 → 个人设置**。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105913.png)

在弹出的窗口中，点击 **开发者配置**，新建一个 API Key，然后点击复制按钮把它复制下来。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105934.png)

> [!warning] 保管好你的 API Key
> API Key 等同于你账号的访问凭证，请勿泄露给他人，也不要直接公开发布到网络上。

### 第五步：把 API Key 粘贴到 IOTO 设置插件中

最后，回到 Obsidian 的 **Vika 同步设置页**，把刚刚复制的 API Key 粘贴到对应位置。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729105956.png)

---

## 测试配置是否成功

配置完成后，就可以把 Obsidian 里的笔记同步到这张数据表了。

在 **任意一篇笔记** 中，按下快捷键 `Alt + V`（macOS 上为 `Option + V`），在弹出的菜单里选择 **上传当前笔记到 Vika** 进行一次测试。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729110019.png)

同步成功后，你会在 **该笔记的属性区** 看到 Vika 相关的同步信息（如记录 ID 等）。

![](https://wafer-1257318448.cos.ap-guangzhou.myqcloud.com/20260729110033.png)

> [!success] 大功告成
> 看到笔记属性里出现 Vika 信息，说明基本同步配置已经成功！之后你就可以随时把笔记同步到 Vika 了。

---

## 小结

完成以上 5 步，你就打通了 IOTO 与 Vika 的基本同步链路：

1. 打开同步模板并另存到自己的空间站
2. 复制 Table ID 填回 IOTO 设置
3. 创建并复制 API Key
4. 把 API Key 粘贴到 IOTO 设置
5. 用 `Alt/Option + V` 测试一次上传