// This example uses MediaRecorder to record from an audio and video stream, and uses the
// resulting blob as a source for a video element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get the video & audio stream from user
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we use as video src

const MIMETYPE_VIDEO_AUDIO = 'video/webm; codecs="opus,vp8"';
var recordButton, stopButton, recorder, liveStream;

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');

  // get video & audio stream from user
  navigator.mediaDevices.getUserMedia({
    video: {
      width: 320,
      height: 280,
      facingMode: "environment",
      frameRate: 24
    }, audio: true
  })
    .then(function (stream) {
      liveStream = stream;

      var liveVideo = document.getElementById('live');
      liveVideo.srcObject = stream;
      liveVideo.play();

      recordButton.disabled = false;
      recordButton.addEventListener('click', startRecording);
      stopButton.addEventListener('click', stopRecording);

    });
};

function startRecording() {
  recorder = new MediaRecorder(liveStream, { mimeType: MIMETYPE_VIDEO_AUDIO });

  recorder.addEventListener('dataavailable', onRecordingReady);

  recordButton.disabled = true;
  stopButton.disabled = false;
  recorder.start(2000);
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

  // Stopping the recorder will eventually trigger the 'dataavailable' event and we can complete the recording process
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