const MIMETYPE_VIDEO_AUDIO = 'video/webm; codecs="opus,vp8"';
var state = "OFF";

function startRecording() {
    if (state == "OFF") {
        var video = document.getElementById("bunny")
        recorder = new MediaRecorder(video.captureStream(), { mimeType: MIMETYPE_VIDEO_AUDIO });
        recorder.addEventListener('dataavailable', onRecordingReady);
        recorder.start(2000);
        state = "ON";
    }
}

function stopRecording() {
    recorder.stop();
}

function onRecordingReady(e) {
    var video = document.getElementById('recording');
    // e.data contains a blob representing the recording
    // video.src = URL.createObjectURL(e.data);
    // video.play();
    var response = new Response(e.data).arrayBuffer().then(function (arrayBuffer) {
        blob = null;
        var ab = new Uint8Array(arrayBuffer)
        var base64String = btoa(ab.reduce((onData, byte) => onData + String.fromCharCode(byte), ''))
        window.base64 = base64String;
        // console.log(base64String);
    });
    response = null;
}