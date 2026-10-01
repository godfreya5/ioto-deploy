<%*
let content = tp.file.content;

const stash = [];
function protect(re) {
  content = content.replace(re, (m) => {
    stash.push(m);
    return `\u0000${stash.length - 1}\u0000`; 
  });
}
protect(/```[\s\S]*?```/g);
protect(/`[^`\n]+`/g);
protect(/\$\$[\s\S]*?\$\$/g);
protect(/\$[^$\n]+?\$/g);

content = content.replace(/==([^=\n]+)==/g, "$1");
content = content.replace(/\*\*([^*]+)\*\*/g, "$1");
content = content.replace(/__([^_]+)__/g, "$1");
content = content.replace(/\*(?!\s)([^*\n]+?)(?<!\s)\*/g, "$1");
content = content.replace(/(?<![\w])_(?!\s)([^_\n]+?)(?<!\s)_(?![\w])/g, "$1");

content = content.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[+i]);

await app.vault.modify(tp.config.active_file, content);
_%>