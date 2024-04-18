"use strict";

require("dotenv/config");
require("./db");
require("./models/Video");
require("./models/User");
var _server = _interopRequireDefault(require("./server"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var PORT = 8080;
// app.get("/", logger, handleHome); //button.addEventListener("click", clickBtn)과 같다.
var handleListening = function handleListening() {
  return console.log("Server listenting on port http://localhost:".concat(PORT, " \uD83D\uDE80"));
};
_server["default"].listen(PORT, handleListening);