<%*
/*
** type: switcher
** for: output
*/
_%>
<%*
const ml = new (tp.user.IOTOMultiLangs(tp))(tp);
const utilClass = tp.user.IOTOUtility(tp, app);
const util = new utilClass(tp, app);
const folder = tp.file.folder(true);
const pathMode = false; 
const prefix = pathMode ? folder : folder.split("/").last();
const activeFileFrontmatter = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter;
const projectName = activeFileFrontmatter?.Project;
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
    { match: `${ml.t("FleetingNotes")}`, template: `My-TP-${ml.t("Output")}-ml.t("FleetingNotes")` },
    { match: `${ml.t("CardNotes")}`, template: `My-TP-${ml.t("Output")}-ml.t("CardNotes")` },
];

const matched = switchers.find(item => prefix.includes(item.match));
let includedNote = "";

let defaultNoteTemplate = "";

if(tp.file.find_tfile(ml.t("IOTODefaultOutputNoteTemplate"))) {
	defaultNoteTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultOutputNoteTemplate"));
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