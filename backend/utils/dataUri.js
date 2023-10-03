const DataUriParser = require("datauri/parser.js");
const path = require("path");

const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extName(file.originalname).toString();
  return parser.format(extName, buffer);
};

module.exports = getDataUri;
