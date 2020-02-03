import PropertyClient from '../parser/parse-properties';

const checkIfPredecessorAlreadyExistsInMap = (key, value) => {
  if (value === undefined || value === null) {
    // eslint-disable-next-line
    value = [key];
  } else {
    value.push(key);
  }
  return value;
};

const isPredecessorConflict = (streamOrJobName, map) => {
  return map.get(streamOrJobName);
};

const getNonPotentialPredecessorList = (streamOrJobName, map) => {
  const checkedList = [streamOrJobName];
  for (let i = 0; i < checkedList.length; i += 1) {
    const parentPredList = isPredecessorConflict(checkedList[i].trim(), map);
    if (parentPredList !== undefined && parentPredList !== null) {
      parentPredList.forEach(parentStreamOrJobName => {
        if (checkedList.indexOf(parentStreamOrJobName.trim()) < 0) {
          checkedList.push(parentStreamOrJobName.trim());
        }
      });
    }
  }
  return checkedList;
};

const getPropertyClient = () => {
  return new PropertyClient().getInstance();
};

const sharedUtilFunctions = {
  checkIfPredecessorAlreadyExistsInMap,
  isPredecessorConflict,
  getNonPotentialPredecessorList,
  getPropertyClient
};

export default sharedUtilFunctions;
