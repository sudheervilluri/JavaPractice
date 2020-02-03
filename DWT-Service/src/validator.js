/**
 * These are the validators for different parameters.
 * It accepts the string to be validated and the length.
 * If maxlength passed is 0 maxlength validation will not be done.
 * asciiValidator is particularly for validating streamname and jobname as in the source
 */

const asciiValidator = (name, maxLength) => {
  if (name.length <= maxLength || maxLength === 0) {
    let asc;
    for (let i = 0; i < name.length; i += 1) {
      asc = name.charCodeAt(i);
      if (
        (asc >= 0 && asc <= 47) ||
        (asc >= 58 && asc <= 64) ||
        (asc >= 91 && asc <= 94) ||
        asc === 96 ||
        (asc >= 123 && asc <= 191) ||
        asc === 215 ||
        asc === 247
      ) {
        throw new Error('string not valid');
      }
    }
    return name;
  }
  throw new Error('string exceeds max length.');
};

const numValidator = (name, maxLength) => {
  const pattern = /^([0-9]+)$/;
  if (pattern.test(name)) {
    if (name.length <= maxLength || maxLength === 0) {
      return name;
    }
    throw new Error('number exceeds max length.');
  } else {
    throw new Error('number is not valid.');
  }
};

const intValidator = number => {
  //  valid integers are from 0 to 9007199254740991 2^53 − 1

  const maxInt = Number.MAX_SAFE_INTEGER;
  const minInt = 0;

  if (number >= minInt && number <= maxInt) {
    return number;
  }
  throw new Error('not a valid integer');
};

const alphaNumValidator = (name, maxLength) => {
  const pattern = /^([a-z0-9]+)$/i;
  if (pattern.test(name)) {
    if (name.length <= maxLength || maxLength === 0) {
      return name;
    }
    throw new Error('string exceeds maxLength.');
  } else {
    throw new Error('string not valid.');
  }
};

const schedularValidator = {
  asciiValidator,
  numValidator,
  alphaNumValidator,
  intValidator
};
export default schedularValidator;
