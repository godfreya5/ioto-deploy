<%*
const types = ["tips","quote","code","table","math","demo"]
const type = await tp.system.suggester((item) => item, types);
const timestamp = tp.date.now("YYYYMMDDHHmmss");
const blockID = `^${type}-${timestamp}`;
-%>
<% blockID %>