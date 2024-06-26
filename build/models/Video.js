"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//mongoose에게 우리의 db가 어떻게 생겼는지 설명

var videoSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 80
  },
  fileUrl: {
    type: String,
    require: true
  },
  thumbUrl: {
    type: String,
    require: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 20
  },
  createdAt: {
    type: Date,
    require: true,
    trim: true,
    "default": Date.now
  },
  hashtags: [{
    type: String,
    trim: true
  }],
  meta: {
    views: {
      type: Number,
      "default": 0,
      required: true
    },
    owner: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  }
}, {
  strictPopulate: false
});
videoSchema["static"]("formatHashtags", function (hashtags) {
  return hashtags.split(",").map(function (word) {
    return word.startsWith("#") ? word : "#".concat(word);
  });
});
var Video = _mongoose["default"].model("Video", videoSchema);
var _default = exports["default"] = Video;