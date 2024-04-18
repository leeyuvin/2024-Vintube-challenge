"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pubilcOnlyMiddleware = exports.protectedMiddleware = exports.localsMiddleware = void 0;
var localsMiddleware = exports.localsMiddleware = function localsMiddleware(req, res, next) {
  //Boolean() : 해당 값이 true이거나 false인지 확인하는 함수
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Vintube";
  res.locals.loggedInUser = req.session.user || {};
  //console.log(req.session);
  next();
};
var protectedMiddleware = exports.protectedMiddleware = function protectedMiddleware(req, res, next) {
  //사용자가 로그인 되어있을 때 요청을 계속함
  if (req.session.loggedIn) {
    return next();
  } // 로그인되어 있지 않을 때 로그인 페이지로 보냄 
  else {
    return res.redirect("/login");
  }
};
var pubilcOnlyMiddleware = exports.pubilcOnlyMiddleware = function pubilcOnlyMiddleware(req, res, next) {
  // 로그인 되어있지 않을 때 요청을 계속함
  if (!req.session.loggedIn) {
    return next();
  } // 로그인 되어있다면 홈으로 보냄 
  else {
    return res.redirect("/");
  }
};
//upload.pug 의 form에서 video파일 받아옴
/* 
    export const videoUpload = multer({
        dest: "uploads/videos/",
        limits: {
            fileSize: 1000000,
        },
    }) 
*/