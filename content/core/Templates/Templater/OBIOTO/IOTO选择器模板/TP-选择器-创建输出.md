<%*
/*
** type: selector
** for: output
*/
const {outputFolder, LTDListOutcomeSectionHeading, LTDListOutputSectionHeading, taskFolder, useUserTemplate, addLinkToCurrentTDL, defaultTDLDateFormat, outputSelectorExcludesPaths, outputSelectorShowOptionOrder, outputSelectorShowBasePath, outputSelectorFolderOptionTemplate, newOutputNoteFollowUpAction, fleetingNoteFolder, fleetingNotePrefix, fleetingNoteDateFormat, outputNoteNamePrefix, outputNoteNamePostfix, outputNoteDefaultExcalidrawTemplate, defaultTDLHeadingLevel, newOutputNoteAddedToTDLFollowUpAction, addNewOutputNoteToTDL} = app.plugins.plugins["ioto-settings"].settings;

const ml = new (tp.user.IOTOMultiLangs(tp))(tp);

const folderSettings = {

    folderPath: outputFolder,
	showSubFolders: true,
    excludesPaths: outputSelectorExcludesPaths ? outputSelectorExcludesPaths.trim().split("\n") : [],
    showBasePathInOption: outputSelectorShowBasePath,
    optionContentTemplate: outputSelectorFolderOptionTemplate,
    showOptionOrder: outputSelectorShowOptionOrder,

}

const switcherTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultOutputSwitcherTemplate"), false);

const noteSettings = {

    template: switcherTemplate,
    defaultNewNoteFollowUpAction: parseInt(newOutputNoteFollowUpAction),
    noteNamePrefix: outputNoteNamePrefix,
    assignedNoteName: tp.file.selection() ? tp.file.selection() : "",
    noteNamePostfix: outputNoteNamePostfix,
    defaultExcalidrawTemplate: outputNoteDefaultExcalidrawTemplate,
    fleetingNoteFolder: fleetingNoteFolder,
    fleetingNotePrefix: fleetingNotePrefix,
    fleetingNoteDateFormat: fleetingNoteDateFormat,
    addLinkToTDL: addNewOutputNoteToTDL,
	addLinkToTDLFollowUpAction: newOutputNoteAddedToTDLFollowUpAction

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
		targetHeading: LTDListOutputSectionHeading,
		headingLevel: defaultTDLHeadingLevel,
		tdlDateFormat: defaultTDLDateFormat,
		followUpAction: parseInt(noteSettings.addLinkToTDLFollowUpAction)
	};
	tR += await tp.user.IOTOAddLinkToTDL(tp, newNoteLink, addLinkToTDLSettings)
} else {
	tR += newNoteLink.tR;
}
_%>
