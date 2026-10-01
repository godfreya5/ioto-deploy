<%*
/*
** type: selector
** for: outcome
*/
const {outcomeFolder, taskFolder, LTDListOutcomeSectionHeading, useUserTemplate, addLinkToCurrentTDL, defaultTDLDateFormat, outcomeSelectorExcludesPaths, outcomeSelectorShowOptionOrder, outcomeSelectorShowBasePath, outcomeSelectorFolderOptionTemplate, outcomeSelectorIncludeParentFolder, outcomeProjectDefaultSubFolders, newOutcomeNoteFollowUpAction, outcomeNoteNamePrefix, outcomeNoteNamePostfix, outcomeNoteDefaultExcalidrawTemplate, defaultTDLHeadingLevel, newOutcomeNoteAddedToTDLFollowUpAction, addNewOutcomeNoteToTDL} = app.plugins.plugins["ioto-settings"].settings;

const ml = new (tp.user.IOTOMultiLangs(tp))(tp);

const folderSettings = {

    isOutcomeSelector: true,

    folderPath: outcomeFolder,
	showSubFolders: true,
    excludesPaths: outcomeSelectorExcludesPaths ? outcomeSelectorExcludesPaths.trim().split("\n") : [],
    showBasePathInOption: outcomeSelectorShowBasePath,
    optionContentTemplate: outcomeSelectorFolderOptionTemplate,
    showOptionOrder: outcomeSelectorShowOptionOrder,
    includeParentFolder: outcomeSelectorIncludeParentFolder,
    taskFolder: taskFolder,
    outcomeProjectDefaultSubFolders: outcomeProjectDefaultSubFolders ? outcomeProjectDefaultSubFolders.trim().split("\n") : [],

}

const switcherTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultOutcomeSwitcherTemplate"), false);

const noteSettings ={
	template: switcherTemplate,
	defaultNewNoteFollowUpAction: parseInt(newOutcomeNoteFollowUpAction),
	noteNamePrefix: outcomeNoteNamePrefix,
	assignedNoteName: tp.file.selection() ? tp.file.selection() : "",
	noteNamePostfix: outcomeNoteNamePostfix,
	defaultExcalidrawTemplate: outcomeNoteDefaultExcalidrawTemplate,
	addLinkToTDL: addNewOutcomeNoteToTDL,
	addLinkToTDLFollowUpAction: newOutcomeNoteAddedToTDLFollowUpAction
}

let folderPath = "";

if(folderSettings.showSubFolders) {
	folderPath = await tp.user.IOTOGetFolderOption(tp, folderSettings);
} else {
	folderPath = folderSettings.folderPath;
}

const newNoteLink = await tp.user.IOTOCreateOrOpenNote(tp, tR, folderPath, noteSettings);

if(noteSettings.addLinkToTDL) {
	const addLinkToTDLSettings = {
		taskFolder: taskFolder,
		targetHeading: LTDListOutcomeSectionHeading,
		headingLevel: defaultTDLHeadingLevel,
		tdlDateFormat: defaultTDLDateFormat,
		followUpAction: parseInt(noteSettings.addLinkToTDLFollowUpAction)
	}
	tR += await tp.user.IOTOAddLinkToTDL(tp, newNoteLink, addLinkToTDLSettings);
} else {
	tR += newNoteLink.tR;
}
_%>
