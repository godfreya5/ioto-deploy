<%*
const iotoUtility = new (tp.user.IOTOUtility(tp, app))(tp, app);if(!iotoUtility.checkIOTOUserPermission()) {return "";}
const ml = new (tp.user.IOTOMultiLangs(tp))(tp);
const {IOTOFrameworkPath, useUserTemplate} = app.plugins.plugins["ioto-settings"].settings;
const defaultPath = `${IOTOFrameworkPath}/Templates/Templater/OBIOTO/IOTO${ml.t("IOTOAuxiliaries")}`;
const customPath = `${IOTOFrameworkPath}/Templates/Templater/MyIOTO/${ml.t("IOTOAuxiliaries")}`;
const path = (useUserTemplate && app.vault.exists(customPath)) ? customPath : defaultPath;
const link = await tp.user.IOTOGetFileOrLinkFromFolder(tp, path, true);
if(!link) return;
_%>
<%_ tp.file.include(link) _%>
