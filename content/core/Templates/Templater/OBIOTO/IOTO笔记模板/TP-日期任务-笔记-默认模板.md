---
cssclasses:
  - ioto-task-cards
---
<%*
const {LTDListInputSectionHeading, LTDListOutputSectionHeading, LTDListOutcomeSectionHeading, defaultTDLDateFormat, projectNameFormat, defaultTDLHeadingLevel} = app.plugins.plugins["ioto-settings"].settings;
_%>

<% defaultTDLHeadingLevel + " " + LTDListInputSectionHeading %>

- [ ] %%Cursor%%

<% defaultTDLHeadingLevel + " " + LTDListOutputSectionHeading %>

- [ ] 

<% defaultTDLHeadingLevel + " " + LTDListOutcomeSectionHeading %>

- [ ] <% tp.file.cursor() %>