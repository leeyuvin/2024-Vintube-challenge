# Wetube Reloaded

// router = /user을 만들고 URL을 추가해 나가도록 해줌 / 도메인별로 라우터를 나누는게 best

#Global router - 홈에서 바로 갈 수 있는 페이지들(깔끔한 코드를 위해 해당부분은 구역설정 제외)
/ -> Home
/join -> Join
/login -> Login
/search -> Search

#user router
/user/:id -> See user
/user/logout -> Log out
/user/edit -> Edit my profile
/user/delete -> Delete my profile

#video router
/video/:id -> Watch video
/video/:id/edit -> Edit video
/video/:id/delete -> Delete video
/video/upload -> Upload video