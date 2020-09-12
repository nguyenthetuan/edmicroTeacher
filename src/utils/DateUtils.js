const formatSecondToDay = (millis) => {
  const minutes = Math.floor(millis / 60);
  const hous = Math.floor(minutes / 60);
  return `${hous}h ${minutes} phút`;
};

const formatDate = (timestamp) => {
  new Date(timestamp * 1000).format('y/m/d h:i:s');
};

/**
 * 01/01/1970
 * @param {*} timestamp 
 * @param {*} sp 
 */
const formatDateYMD = (timestamp, sp = '/') => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`;
  const day = `0${date.getDate()}`;
  const formattedTime = `${day.substr(-2)}${sp}${month.substr(-2)}${sp}${year}`;
  return formattedTime;
};

/**
 * 01/01/70
 * @param {*} timestamp 
 * @param {*} sp 
 */
const formatDateYmd = (timestamp, sp = '/') => {
  const date = new Date(timestamp * 1000);
  const year = `${date.getFullYear()}`;
  const month = `0${date.getMonth() + 1}`;
  const day = `0${date.getDate()}`;
  const formattedTime = `${day.substr(-2)}${sp}${month.substr(-2)}${sp}${year.substr(-2)}`;
  return formattedTime;
};

/**
 * 01:01 01/01/1970
 * @param {*} timestamp 
 * @param {*} sp 
 */
const formatDateHMYMD = (timestamp, sp = '/') => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`;
  const day = `0${date.getDate()}`;
  const hour = date.getHours();
  const minute = date.getMinutes();
  const fm = `${hour}:${minute} ${day.substr(-2)}${sp}${month.substr(-2)}${sp}${year}`;
  return fm;
};

/**
 * 1
 * @param {*} timestamp 
 */
const getDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.getDate();
};

/**
 * 1-12
 * @param {*} timestamp 
 */
const getMonth = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.getMonth() + 1;
};

/**
 * 70
 * @param {*} timestamp 
 */
const getYear = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.getYear();
};

/**
 * 1970
 * @param {*} timestamp 
 */
const getFullYear = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.getFullYear();
};

/**
 * key1,key2 field 
 * Sort asc
 * recent.sort((a, b) => {
    const key1 = a.field;
    const key2 = b.field;
    return DateUtils.sortAsc(key1, key2);
  });
 * @param {*} key1 
 * @param {*} key2 
 */
const sortAsc = (key1, key2) => key1 - key2;
const sortDesc = (key1, key2) => key2 - key1;

module.exports = {
  getDay,
  getMonth,
  getYear,
  getFullYear,
  formatDateYMD,
  formatDateHMYMD,
  formatDateYmd,
  formatDate,
  sortAsc,
  sortDesc,
  formatSecondToDay
};
