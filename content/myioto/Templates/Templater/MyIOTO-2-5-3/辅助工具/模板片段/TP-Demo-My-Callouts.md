<%*
const types = ["Note","Info", "Question", "Danger", "Example"];

const choice = await tp.system.suggester(item => item, types);

const content = tp.file.selection() ? tp.file.selection() : await tp.system.clipboard();

const newContent = content
					.split("\n")
					.map(line => "> " + line)
					.join("\n");
					
_%>

> [!<% choice %>]- Title
<% newContent %>

