import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: String,
    //user가 github로 로그인 했는지의 여부를 알기 위해
    socialOnly: { type: Boolean, default: false },
    username: { type: String, required: true, unique: true },
    //password가 필요없는 조건들이 있기때문에 필수로 지정하지 않기. required: false가 기본값
    password: { type: String },
    name: { type: String, required: true },
    location: String,
});

userSchema.pre("save", async function () {
    //함수 안에 있는 this.password는 유저가 입력한 password를 말한다.
    /* suser의 password를 암호화시킨 다음에 저장하는 함수 */
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);
export default User;