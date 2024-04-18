import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "비밀번호가 서로 일치하지 않습니다."
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "이미 사용중인 아이디/이메일입니다.",
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            //첫번째 password와 확인용 password2가 같아야하기 때문에 처음 password만 적기
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render(
            "join",
            {
                pageTitle,
                errorMessage: error._message,
            });
    }
};
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    //password가 존재하는 경우 socialOnly: false / 아닌 경우 true
    const user = await User.findOne({ username, socialOnly: false });
    // check if account exists
    if (!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "입력한 아이디를 가진 사용자가 존재하지 않습니다.",
        });
    }
    // check if password correct
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "비밀번호를 다시 확인해주세요.",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

// configuration parameter를 통해 url 만들기.
export const startGithubLogin = (req, res) => {
    const baseURL = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        // scope에 명시하면 github가 코드를 준다.
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    return res.redirect(finalURL);
};

export const finishGithubLogin = async (req, res) => {
    // baseURL이 access_token으로 바뀜 (사이트에서 복사해오기)
    const baseURL = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        // client_secret은 backend에만 존재해야하는 정보
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    // fetch로 데이터를 받아옴
    const tokenRequest = await (await fetch(finalURL, {
        method: "POST",
        // json 을 받아오기 위해 적어야하는 부분
        headers: {
            Accept: "application/json"
        }
    })).json();
    // if 안에 access_token 이 있을 경우
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        console.log(userData);
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailObj = emailData.find(
            //email을 DB에서 찾기
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        //유저를 찾으면 loggedIn
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            //Github data를 통해 user 생성
            user = await User.create({
                name: userData.name,
                avatarUrl: userData.avatar_url,
                username: userData.login,
                email: emailObj.email,
                password: "",
                //github를 통해 생성되엇고, password가 없음.
                //그러면 username과 password form사용이 불가능하기 때문에 아래의 내용 기재
                socialOnly: "true",
                location: userData.location,
            });
            //user 로그인
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
    } else {
        // 계정 생성하는 내용 추가(해당 email로 user가 없기 때문)
        return res.redirect("/login");
    }
};

export const startKakaoLogin = (req, res) => {
    const kakaoURL = "https://kauth.kakao.com/oauth/authorize";
    const config = {
        client_id: process.env.KT_CLIENT,
        redirect_uri: "http://localhost:5000/kakaologin",
        allow_signup: false,
        //scope: "account_email"
    };
    const params = new URLSearchParams(config).toString();
    const finalURL = `${kakaoURL}?${params}`;
    return res.redirect(finalURL);
};
export const finishKakaoLogin = async (req, res) => {
    const kakaoURL = "https://kauth.kakao.com/oauth/token";
    const config = {
        client_id: process.env.KT_CLIENT,
        redirect_uri: "http://localhost:5000/kakaologin",
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalURL = `${kakaoURL}?${params}`;
    const data = await fetch(finalURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    const json = await data.json();
    console.log(json);
    res.send(JSON.stringify(json));
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/")
};
export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });

};

export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { name, email, username, location }
    } = req;
    const updateUser = await User.findByIdAndUpdate(_id, {
        // 해당 변수들이 form에서 오기 때문에 name값을 입력해서 불러와주기
        name: name, email: email, username: username, location: location
    },
        { new: true });
    req.session.user = updateUser;
    return res.redirect("/user/edit")
};

export const getChangePassword = (req, res) => {
    // 외부 링크를 통해 로그인했을 경우 비밀번호가 없기때문에 변경페이지 없애기
    if (req.session.user.socialOnly === true) {
        return res.redirect("/")
    }
    return res.render("user/change-password", { pageTitle: "Change Password" })
};
export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { oldPassword, newPassword, newPasswordConfirm },
    } = req;
    // user를 찾아 db에 있는 가장 최신비밀번호 사용
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
        return res.status(400).render("user/change-password", {
            pageTitle: "Change Password", errorMessage: "기존 비밀번호가 일치하지 않습니다."
        })
    }
    if (newPassword !== newPasswordConfirm) {
        // 브라우저는 status code를 주시하고 있다. 유의하라
        return res.status(400).render("user/change-password", {
            pageTitle: "Change Password", errorMessage: "변경할 비밀번호가 일치하지 않습니다."
        })
    }
    // password hash를 위하여
    user.password = newPassword;
    // save가 promise 일 경우 대비하여 await 작성
    await user.save();
    // 비밀번호를 바꿨음을 알려주는 알림을 보낼 예정
    return res.redirect("/")
};

export const see = (req, res) => res.send("See");
