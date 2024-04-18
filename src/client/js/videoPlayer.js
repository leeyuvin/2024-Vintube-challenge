const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.value = volumeValue;

const handlePlayClick = (e) => {
    //진행중인 비디오 멈추기
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
const handleMute = (event) => {
    if (video.muted) {
        video.muted = false;
        video.value = volumeValue;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted
        ? "fas fa-volume-mute"
        : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolumeChange = (event) => {
    const { target: { value } } = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = Mute;
    }
    volumeValue = value;
    video.volume = value;
};

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handelTimelineChange = (event) => {
    const {
        target: { value },
    } = event;
    video.currentTime = value;
};

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullScreenBtnIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtnIcon.classList = "fas fa-compress";
    }
};

const hideControls = videoControls.classList.remove("showing");


const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMoustLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handelTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("moustleave", handleMoustLeave);