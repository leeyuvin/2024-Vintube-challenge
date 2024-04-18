"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// 서버와 database서버 사이의 현재 connection에 엑세스 가능
_mongoose["default"].connect(process.env.DB_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});
var db = _mongoose["default"].connection;
var handleOpen = function handleOpen() {
  return console.log("🌍 Connected to DB");
};
db.on("error", function (error) {
  return console.log("❌ DB Error", error);
});
db.once("open", handleOpen);