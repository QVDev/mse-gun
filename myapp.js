//Configure GUN to pass to streamer
var peers = ['https://livecodestream-us.herokuapp.com/gun', 'https://livecodestream-eu.herokuapp.com/gun'];
var opt = { peers: peers, localStorage: false, radisk: false };
var gunDB = Gun(opt);
var base64 = "GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwH/////////FUmpZpkq17GDD0JATYCGQ2hyb21lV0GGQ2hyb21lFlSua+quvdeBAXPFh8AW9Fh6m8uDgQKGhkFfT1BVU2Oik09wdXNIZWFkAQIAAIC7AAAAAADhjbWERzuAAJ+BAmJkgSCuqdeBAnPFh8XPY+gj5/uDgQFV7oEBhoVWX1ZQOOCMsIIEsLqCA4RTwIEB"
var mediaData = base64;

// Get data from gun and pass along to viewer
gunDB.get("qvdev").on(function(data) {
    mediaData = data.data;
});

var manifestUri = 'new.mpd';

// Tunnel function
function Tunnel(uri, request, requestType, progressUpdated) {
    console.log(uri)
        // This part is for my buffered stream
    if (uri.endsWith(".gun")) {
        let data = shaka.util.Uint8ArrayUtils.fromBase64(mediaData).buffer;
        return {
            uri: uri,
            data: data
        };
    }
    // without "HttpFetchPlugin.parse()" function I can ignore and forward other requests 
    return shaka.net.HttpFetchPlugin(uri, request, requestType, progressUpdated);
}

async function initApp() {
    // Install built-in polyfills to patch browser incompatibilities.

    var stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    document.getElementById("bunny").srcObject = stream;

    shaka.polyfill.installAll();

    // navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        shaka.media.ManifestParser.registerParserByExtension(
            'mpd', shaka.dash.DashParser);
        shaka.media.ManifestParser.registerParserByMime(
            'application/dash+xml', shaka.dash.DashParser);
        shaka.media.ManifestParser.registerParserByMime(
            'video/vnd.mpeg.dash.mpd', shaka.dash.DashParser);

        shaka.log.setLevel(shaka.log.Level.V1);
        shaka.net.NetworkingEngine.registerScheme('http', Tunnel);
        shaka.net.NetworkingEngine.registerScheme('https', Tunnel);

        initPlayer();
    } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!');
    }
}

function initPlayer() {
    // Create a Player instance.
    var video = document.getElementById('shaka');
    var player = new shaka.Player(video);

    // Construct the UI overlay
    // const videoContainer = document.getElementById('container-shaka');;
    // const ui = new shaka.ui.Overlay(player, videoContainer, video);
    // const config = {
    //     addSeekBar: false
    // };
    // ui.configure(config);

    // const controls = ui.getControls();

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    player.configure({
        streaming: {
            rebufferingGoal: 2,
            bufferingGoal: 3,
            bufferBehind: 1,
            ignoreTextStreamFailures: false,
            alwaysStreamText: false,
            startAtSegmentBoundary: false,
            smallGapLimit: 0.01,
            jumpLargeGaps: true,
            durationBackoff: 0,
            forceTransmuxTS: false,
            safeSeekOffset: 0.1,
            stallEnabled: false,
            stallThreshold: 1,
            stallSkip: 0.5,
            useNativeHlsOnSafari: true
        }
    });

    // Listen for error events.
    player.addEventListener('error', onErrorEvent);


    // Try to load a manifest.
    // This is an asynchronous process.
    player.load(manifestUri).then(function() {
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
    }).catch(onError); // onError is executed if the asynchronous load fails.

    video.addEventListener('loadedmetadata', function() {

        console.log("ReadyState" + video.readyState);

    });
}

function onErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    onError(event.detail);
}

function onError(error) {
    // Log the error.
    console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);