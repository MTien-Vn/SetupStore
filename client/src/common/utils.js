import moment from "moment";
import { dateFormat } from "src/components/picker/RangePicker";

export const formatFromNow = (date) => moment(date).fromNow();

export const formatDate = (date, format = dateFormat) => moment(date).format(format);

export const isSameTime = (date1, date2) => moment(date1).isSame(moment(date2));

export const isBetweenDate = (date, fromDate, toDate) => moment(date).isBetween(fromDate, toDate);

export const sorterByWords = (sorterKey) => (a, b) =>
  vietnameseSlug(a[sorterKey]) > vietnameseSlug(b[sorterKey])
    ? 1
    : vietnameseSlug(b[sorterKey]) > vietnameseSlug(a[sorterKey])
    ? -1
    : 0;

export const getNameByValue = (value = "", arr = []) =>
  arr.find((item) => item.value === value)?.name || null;

export const sorterByDate = (sorterKey) => (a, b) => moment(b[sorterKey]) - moment(a[sorterKey]);

export const getBadgeColorByStatus = (s) => {
  switch (s) {
    case "active":
      return "green";
    case "inactive":
      return "#8c8c8c";
    case "deleted":
      return "red";
    default:
      return "yellow";
  }
};

export const setColorByStatus = (orderStatus) => {
  switch (orderStatus.toUpperCase()) {
    case "PROCESSING":
      return "blue";
    case "CANCELLING":
      return "yellow";
    case "PACKED":
      return "green";
    case "DELIVERING":
      return "blue";
    case "DELIVERED":
      return "green";
    case "CANCELLED":
      return "red";
    default:
      return "#8c8c8c";
  }
};

export const findImageById = (id = "", images = []) => {
  return id ? images.find((item) => item._id === id) : null;
};

export const bindParamsFilter = (filter) => {
  const params = Object.keys(filter)
    .filter((key) => filter[key] === false || filter[key] === 0 || !!filter[key])
    .map((key) => `${key}=${filter[key]}`);
  return params.join("&");
};

export const convertToNumber = (value) => (Number.isNaN(Number(value)) ? 0 : Number(value));

export const getTotalPage = (total, limit) => {
  let totalPage =
    total % limit === 0 ? (total - (total % limit)) / limit : (total - (total % limit)) / limit + 1;
  totalPage = convertToNumber(totalPage);
  return totalPage === 0 ? 1 : totalPage;
};

export const checkValidColor = (value) =>
  value ? /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value.replace(/\s/g, "")) : false;

export const vietnameseSlug = (str, separator = "-") => {
  if (str) {
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
    // Remove extra spaces
    // B??? c??c kho???ng tr???ng li???n nhau
    str = str.replace(/ + /g, "");
    // Remove punctuations
    // B??? d???u c??u, k?? t??? ?????c bi???t
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\\=|\\<|\\>|\?|\/|,|\.|\\:|\\;|\\'|\\"|\\&|\\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ""
    );
    str = str.replace(/ +/g, "-");
    if (separator) {
      return str.replace(/-/g, separator);
    }
    return str;
  } else return "";
};
