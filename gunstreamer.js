//Config for the GUN GunStreamer
var streamer_config = {
    dbRecord: "gunmeeting", //The root of the streams
    streamId: "qvdev", //The user id you wanna stream
    gun: gunDB, //Gun instance
    debug: false, //For debug logs
    url: "https://cdn.jsdelivr.net/gh/QVDev/GunStreamer@0.0.9/js/parser_worker.js"
};

function onStreamerData(data) {
    console.log(data);
}

//GUN Streamer is the data side. It will convert data and write to GUN db
const gunStreamer = new GunStreamer(streamer_config)

//This is a callback function about the recording state, following states possible
// STOPPED: 1¸
// RECORDING:2
// NOT_AVAILABLE:3
// UNKNOWN:4
var onRecordStateChange = function(state) {
    var recordButton = document.getElementById("record_button");
    if (recordButton == undefined) {
        return;
    }
    switch (state) {
        case recordState.RECORDING:
            recordButton.innerText = "Stop recording";
            break;
        default:
            recordButton.innerText = "Start recording";
            break;
    }
}

const MIMETYPE_VIDEO_AUDIO = 'video/webm; codecs="opus,vp8"';

//Config for the gun recorder
var recorder_config = {
    mimeType: MIMETYPE_VIDEO_AUDIO,
    video_id: "bunny", //Video html element id
    onDataAvailable: gunStreamer.onDataAvailable, //MediaRecorder data available callback
    onRecordStateChange: onRecordStateChange, //Callback for recording state
    recordInterval: 1000,
    experimental: false, //This is custom time interval and very unstable with audio. Only video is more stable is interval quick enough? Audio
    debug: false //For debug logs
}

//Init the recorder
const gunRecorder = new GunRecorder(recorder_config);
gunRecorder.recordState = recordState.STOPPED