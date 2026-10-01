<%*
/*
** type: selector
** for: input
*/
const {inputFolder, LTDListInputSectionHeading, LTDListOutputSectionHeading, taskFolder, useUserTemplate, addLinkToCurrentTDL, defaultTDLDateFormat, inputSelectorExcludesPaths, inputSelectorShowOptionOrder, inputSelectorShowBasePath, inputSelectorFolderOptionTemplate, newInputNoteFollowUpAction, inputNoteNamePrefix, inputNoteNamePostfix, inputNoteDefaultExcalidrawTemplate, defaultTDLHeadingLevel, newInputNoteAddedToTDLFollowUpAction, addNewInputNoteToTDL} = app.plugins.plugins["ioto-settings"].settings;

const ml = new (tp.user.IOTOMultiLangs(tp))(tp);

const folderSettings = {

    folderPath: inputFolder,
	showSubFolders: true,
    excludesPaths: inputSelectorExcludesPaths ? inputSelectorExcludesPaths.trim().split("\n") : [],
    showBasePathInOption: inputSelectorShowBasePath,
    optionContentTemplate: inputSelectorFolderOptionTemplate,
    showOptionOrder: inputSelectorShowOptionOrder,

}

const switcherTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultInputSwitcherTemplate"), false);

const noteSettings = {
	template: switcherTemplate,
	defaultNewNoteFollowUpAction: parseInt(newInputNoteFollowUpAction),
    noteNamePrefix: inputNoteNamePrefix,
    assignedNoteName: tp.file.selection() ? tp.file.selection() : "",
    noteNamePostfix: inputNoteNamePostfix,
    defaultExcalidrawTemplate: inputNoteDefaultExcalidrawTemplate,
	addLinkToTDL: addNewInputNoteToTDL,
	addLinkToTDLFollowUpAction: newInputNoteAddedToTDLFollowUpAction
}

let folderPath = "";

if(folderSettings.showSubFolders) {
	folderPath = await tp.user.IOTOGetFolderOption(tp, folderSettings);
} else {
	folderPath = folderSettings.folderPath;
}

const newNoteLink = await tp.user.IOTOCreateOrOpenNote(tp, tR, folderPath, noteSettings);

if(noteSettings.addLinkToTDL){
	const addLinkToTDLSettings = {
		taskFolder: taskFolder,
		targetHeading: LTDListInputSectionHeading,
		headingLevel: defaultTDLHeadingLevel,
		tdlDateFormat: defaultTDLDateFormat,
		followUpAction: parseInt(noteSettings.addLinkToTDLFollowUpAction)
	};
	tR += await tp.user.IOTOAddLinkToTDL(tp, newNoteLink, addLinkToTDLSettings);
} else {
	tR += newNoteLink.tR;
}
_%>