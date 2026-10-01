<%*
/*
** type: switcher
** for: outcome
*/
_%>
<%*
const ml = new (tp.user.IOTOMultiLangs(tp))(tp);
const utilClass = tp.user.IOTOUtility(tp, app);
const util = new utilClass(tp, app);
const folder = tp.file.folder(true);
const pathMode = false; 
const prefix = pathMode ? folder : folder.split("/").last();
const {projectNameFormat} = app.plugins.plugins["ioto-settings"].settings;
const activeFileFrontmatter = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter;
const projectName = activeFileFrontmatter?.Project || await tp.user.IOTOCreateProjectName(tp.file.folder(true), projectNameFormat);
const subjectName = activeFileFrontmatter?.Subject;
const planName = activeFileFrontmatter?.Plan;

const frontMatter = {
	Project: `["${projectName}"]`
};

if (subjectName) {
    frontMatter.Subject = `["${subjectName}"]`;
}

if (planName) {
    frontMatter.Plan = `["${planName}"]`;
}

const switchers = [
    { match: `${ml.t("Articles")}`, template: `My-TP-${ml.t("Outcome")}-${ml.t("Articles")}` },
    { match: `${ml.t("Reports")}`, template: `My-TP-${ml.t("Outcome")}-${ml.t("Reports")}` },
];

const matched = switchers.find(item => prefix.includes(item.match));
let includedNote = "";

let defaultNoteTemplate = "";

if(tp.file.find_tfile(ml.t("IOTODefaultOutcomeNoteTemplate"))) {
	defaultNoteTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultOutcomeNoteTemplate"));
}

if (matched) {
	const templateWillBeUsed = await tp.user.IOTOLoadTemplate(tp, tR, this.app, matched.template, false);
	const matchedTemplate = tp.file.find_tfile(templateWillBeUsed);
	includedNote = matchedTemplate ? (await tp.file.include(`[[${templateWillBeUsed}]]`)) : defaultNoteTemplate; 
} else {
	includedNote = defaultNoteTemplate;
}

tR += util.noteFrontMatterCooker(util.addIOOLinkPropertyToFrontMatter(frontMatter, tp.config.active_file), includedNote);
_%>