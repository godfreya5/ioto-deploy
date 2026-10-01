<%*
/*
** type: selector
** for: task
*/
_%>
<%*
const {
    taskFolder,
    defaultTDLDateFormat,
    projectNameFormat,
    taskSelectorExcludesPaths,
    taskSelectorShowOptionOrder,
    taskSelectorShowBasePath,
    taskSelectorFolderOptionTemplate,
    taskSelectorEnableFutureDaysChoices,
    taskSelectorEnableSubjectTask,
    taskSelectorEnablePlanTask,
    taskSelectorEnableNormalTask,
} = app.plugins.plugins["ioto-settings"].settings;

const ml = new (tp.user.IOTOMultiLangs(tp))(tp);
const selectedText = ((tp.file.selection && tp.file.selection()) || "").trim();
const activeFileBaseName = tp.config?.active_file?.basename ?? "";
const currentFolderPath = tp.file?.folder?.(true) ?? "";
const isInTaskFolder = currentFolderPath ? currentFolderPath.startsWith(taskFolder) : false;
const onlyUseDateType = !(taskSelectorEnableSubjectTask || taskSelectorEnablePlanTask || taskSelectorEnableNormalTask);

const folderSettings = {
    folderPath: taskFolder,
    showSubFolders: true,
    excludesPaths: taskSelectorExcludesPaths ? taskSelectorExcludesPaths.split("\n") : [],
    showBasePathInOption: taskSelectorShowBasePath,
    optionContentTemplate: taskSelectorFolderOptionTemplate,
    showOptionOrder: taskSelectorShowOptionOrder,
};

const switcherTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultTaskSwitcherTemplate"), false);

const noteSettings = {
    template: switcherTemplate,
    enableFutureDaysChoices: taskSelectorEnableFutureDaysChoices,
    timestampFormat: defaultTDLDateFormat,
    projectNameFormat: projectNameFormat,
    useCustomTDLName: false,
    createPlanMode: false,
    taskType: "date",
    upTask: null,
    selectedText,
};

let folderPath = "";
let scope = "otherProject";

if (isInTaskFolder) {
    const baseChoices = [ml.t("CreateTaskForCurrentProject"), ml.t("CreateTaskForOtherProject")];
    const baseValues = ["currentProject", "otherProject"];
    const scopeChoices = onlyUseDateType 
        ? baseChoices 
        : [ml.t("CreateSubTaskForCurrent"), ...baseChoices];
    const scopeValues = onlyUseDateType 
        ? baseValues 
        : ["subTask", ...baseValues];
    const labeledChoices = scopeChoices.map((choice, index) => `${index + 1}. ${choice}`);
    const selectedScope = await tp.system.suggester(labeledChoices, scopeValues);

    if (!selectedScope) {
        if (selectedText) {
            tR += selectedText;
        }
        return tR;
    } else {
        scope = selectedScope;
    }

}

if (scope === "subTask") {
    noteSettings.upTask = activeFileBaseName ? `[[${activeFileBaseName}]]` : null;
    folderPath = currentFolderPath;
} else if (scope === "currentProject") {
    folderPath = currentFolderPath;
} else {
    if (scope === "otherProject" && isInTaskFolder) {
        folderSettings.excludesPaths = [
        ...folderSettings.excludesPaths,
        currentFolderPath,
        ];
    }
    if (folderSettings.showSubFolders) {
            folderPath = await tp.user.IOTOGetFolderOption(tp, folderSettings);
    } else {
            folderPath = folderSettings.folderPath;
    }

}

if (!folderPath || !scope) {
    if (selectedText) {
        tR += selectedText;
    }
    return tR;
}

const taskTypeChoices = [ml.t("CreateDateTask")];
const taskTypeValues = ["date"];

if (Boolean(taskSelectorEnableSubjectTask)) {
    taskTypeChoices.push(ml.t("CreateSubjectTask"));
    taskTypeValues.push("subject");
}

if (Boolean(taskSelectorEnablePlanTask)) {
    taskTypeChoices.push(ml.t("CreatePlanTask"));
    taskTypeValues.push("plan");
}

if (Boolean(taskSelectorEnableNormalTask)) {
    taskTypeChoices.push(ml.t("CreateNormalTask"));
    taskTypeValues.push("normal");
}

let selectedTaskType = "";
if (taskTypeValues.length === 1) {
    selectedTaskType = taskTypeValues[0];
} else {
    const labledTaskTypeChoices = taskTypeChoices.map((choice, index) => `${index + 1}. ${choice}`);
    selectedTaskType = await tp.system.suggester(labledTaskTypeChoices, taskTypeValues);
}

if (!selectedTaskType) {
    if (selectedText) {
    tR += selectedText;
    }
    return tR;
} else {
    noteSettings.taskType = selectedTaskType;
}

tR += await tp.user.IOTOCreateTasksList(tp, folderPath, noteSettings) || "";
_%>
