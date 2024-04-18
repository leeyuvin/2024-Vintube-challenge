import express from "express";
import morgan from "morgan"; //이름이 같을 필요는 없다. from만 정확하면 된다.
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

console.log(process.env.COOKIE_SECRET, process.env.DB_URL);

//express라는 어플리케이션 생성 코드
const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
//app.locals.basedir = process.cwd();
app.use(logger);
app.use(express.urlencoded({ extended: true }));

//백엔드(localhost)에 정보를 제공 * 쿠키 * 브라우저가 명령하는 행동
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    })
);
//session 미들웨어 바로 아래 위치해야함
app.use(localsMiddleware);
// express에게 폴더를 유저들에게 공개해달라 설정하는 영역
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;