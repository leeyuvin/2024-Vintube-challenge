//mongoose에게 우리의 db가 어떻게 생겼는지 설명

import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80 },
    fileUrl: { type: String, require: true },
    thumbUrl: { type: String, require: true },
    description: { type: String, required: true, trim: true, minLength: 20 },
    createdAt: { type: Date, require: true, trim: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
    },
}, { strictPopulate: false });
videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags
        .split(",")
        .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
