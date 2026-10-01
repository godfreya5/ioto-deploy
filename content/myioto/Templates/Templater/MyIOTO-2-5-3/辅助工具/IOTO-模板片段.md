<%*
const settings = {
	path: this.app.plugins.plugins["ioto-settings"].settings.iotoUtilsTemplateSnippetFolder.trim()
}
const link = await tp.user.IOTOGetFileOrLinkFromFolder(tp, settings.path, true);
if(!link) return "";
_%>
<% tp.file.include(link) _%>