module.exports.buildKey = (prefix, obj) => {

  return prefix + ":" + Buffer
    .from(JSON.stringify(obj))
    .toString("base64");
};
