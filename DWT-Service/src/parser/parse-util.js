const xml2js = require('xml2js');

module.exports = {};

const getParser = () => {
  return new xml2js.Parser();
};

/**
 * This is a wrapper fucntion that is used to parse the given xml doc to Json.
 * The result is a json object.
 * @param {xmlDoc} data
 * @param {function} callback
 */
const getParsedJSON = (data, callback) => {
  const parser = getParser();
  parser.parseString(data, (err, result) => {
    callback(err, result);
  });
};

module.exports.getParser = getParser;
module.exports.getParsedJSON = getParsedJSON;
