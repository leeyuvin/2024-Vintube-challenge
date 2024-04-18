"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _connectMongo = _interopRequireDefault(require("connect-mongo"));
var _rootRouter = _interopRequireDefault(require("./routers/rootRouter"));
var _userRouter = _interopRequireDefault(require("./routers/userRouter"));
var _videoRouter = _interopRequireDefault(require("./routers/videoRouter"));
var _apiRouter = _interopRequireDefault(require("./routers/apiRouter"));
var _middlewares = require("./middlewares");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//이름이 같을 필요는 없다. from만 정확하면 된다.

console.log(process.env.COOKIE_SECRET, process.env.DB_URL);

//express라는 어플리케이션 생성 코드
var app = (0, _express["default"])();
var logger = (0, _morgan["default"])("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
//app.locals.basedir = process.cwd();
app.use(logger);
app.use(_express["default"].urlencoded({
  extended: true
}));

//백엔드(localhost)에 정보를 제공 * 쿠키 * 브라우저가 명령하는 행동
app.use((0, _expressSession["default"])({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: _connectMongo["default"].create({
    mongoUrl: process.env.DB_URL
  })
}));
//session 미들웨어 바로 아래 위치해야함
app.use(_middlewares.localsMiddleware);
// express에게 폴더를 유저들에게 공개해달라 설정하는 영역
app.use("/uploads", _express["default"]["static"]("uploads"));
app.use("/assets", _express["default"]["static"]("assets"));
app.use("/", _rootRouter["default"]);
app.use("/user", _userRouter["default"]);
app.use("/videos", _videoRouter["default"]);
app.use("/api", _apiRouter["default"]);
var _default = exports["default"] = app;