const uuidv1 = require('uuid/v1');

module.exports.generateIntID=()=>{
  const i = new Date().getTime();
  return i & 0xffffffff;
}

module.exports.generateUUID=()=>{
  return uuidv1();
}