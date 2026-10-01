<%*
/*
** type: switcher
** for: task
*/
_%>
<%*

const ml = new (tp.user.IOTOMultiLangs(tp))(tp);
const {LTDListInputSectionHeading, LTDListOutputSectionHeading, LTDListOutcomeSectionHeading, defaultTDLDateFormat, projectNameFormat, defaultTDLHeadingLevel} = app.plugins.plugins["ioto-settings"].settings;

const utilClass = tp.user.IOTOUtility(tp, app);
const util = new utilClass(tp, app);
const folder = tp.file.folder(true);
const pathMode = false; 
const prefix = pathMode ? folder : folder.split("/").last();
const activeFileFrontmatter = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter;
const projectName = await tp.user.IOTOCreateProjectName(tp.file.folder(true), projectNameFormat);
const subjectName = activeFileFrontmatter?.Subject;
const planName = activeFileFrontmatter?.Plan;

const frontMatter = {
	Project: `["${projectName}"]`,
	cssclasses: '["hideProperties", "iotoTDL"]'
}

const taskMetaStore = app.plugins.plugins["ioto-settings"].__iotoTaskMeta;
const taskMetaKey = tp.file.path(true);
const pendingMeta = (taskMetaStore && taskMetaStore[taskMetaKey]) || null;
if (pendingMeta && pendingMeta.upTask) {
        frontMatter.UpTask = pendingMeta.upTask;
}
if (taskMetaStore) delete taskMetaStore[taskMetaKey];

const switchers = [
    { match: "Demo", template: `My-TP-${ml.t("Task")}-Demo` }
];

const matched = switchers.find(item => prefix.includes(item.match));
let includedNote = "";

const templates = {
  note: "IOTODefaultTaskNoteTemplate",
  subject: "IOTODefaultSubjectNoteTemplate",
  plan: "IOTODefaultPlanNoteTemplate",
  normal: "IOTODefaultNormalNoteTemplate",
};

const [defaultNoteTemplate, defaultSubjectTemplate, defaultPlanTemplate, defaultNormalTemplate] = await Promise.all(
  Object.values(templates).map(async key => {
    const tFile = tp.file.find_tfile(ml.t(key));
    return tFile ? await tp.user.IOTOLoadTemplate(tp, tR, app, ml.t(key)) : "";
  })
);

if (matched) {
	const matchedTemplate = tp.file.find_tfile(matched.template);
	includedNote = matchedTemplate ? (await tp.file.include(`[[${matched.template}]]`)) : defaultNoteTemplate; 
} else if(tp.file.title.includes(`-${ml.t("Subject")}-`)) {
	frontMatter.Subject = [`"${tp.file.title.split("-").last()}"`];
	includedNote = defaultSubjectTemplate;
} else if(tp.file.title.includes(`-${ml.t("Plan")}-`)) {
	frontMatter.Plan = [`"${tp.file.title.split("-").last()}"`];
	if (subjectName) {
    	frontMatter.Subject = `["${subjectName}"]`;
	}
	includedNote = defaultPlanTemplate;
} else if(!tp.file.title.startsWith(`${projectName}-`)) {
    if (subjectName) {
        frontMatter.Subject = `["${subjectName}"]`
    }
    if (planName) {
        frontMatter.Plan = `["${planName}"]`;
    }
	includedNote = defaultNormalTemplate;
} else {
	includedNote = defaultNoteTemplate;
}

tR += util.noteFrontMatterCooker(frontMatter, includedNote);
_%>
