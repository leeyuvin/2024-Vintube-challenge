import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};
const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

const handleDownload = async () => {
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;

    const baseURL = "https://unpkg.com/@ffmpeg/core@^0.12.6/dist/umd";
    const ffmpeg = new FFmpeg();
    ffmpeg.on({ log: true });

    const coreResponse = await fetch(`${baseURL}/ffmpeg-core.js`);
    const wasmResponse = await fetch(`${baseURL}/ffmpeg-core.wasm`);
    const coreBlob = new Blob([await coreResponse.text()], { type: "text/javascript" });
    const wasmBlob = new Blob([await wasmResponse.arrayBuffer()], { type: "application/wasm" });
    const coreURL = URL.createObjectURL(coreBlob);
    const wasmURL = URL.createObjectURL(wasmBlob);
    await ffmpeg.load({ coreURL, wasmURL });

    await ffmpeg.writeFile(files.input, await fetchFile(videoFile));

    await ffmpeg.exec(["-i", files.input, "-r", "60", files.output]);
    await ffmpeg.exec([
        "-i",
        files.input,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumb
    ]);

    const mp4File = await ffmpeg.readFile(files.output);
    const thumbFile = ffmpeg.readFile(files.thumb);

    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

    // URL을 통해 파일에 접근
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);


    //dowunloadFile 요약(video, thumbnail)
    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl, "MyThumbnail.jpg");

    ffmpeg.deleteFile(files.input);
    ffmpeg.deleteFile(files.output);
    ffmpeg.deleteFile(files.thumb);
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    // 새로 녹화하기
    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStart);

};
const handleStop = () => {
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStop)
    actionBtn.addEventListener("click", handleDownload);
    recorder.stop();
};
const handleStart = () => {
    actionBtn.innerText = "Stop Recording";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();
};
const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
};

init();

actionBtn.addEventListener("click", handleStart);