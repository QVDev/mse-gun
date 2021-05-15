function MyManifestParser() {
    this.curId_ = 0;
    this.config_ = null;
}

MyManifestParser.prototype.configure = function (config) {
    goog.asserts.assert(config.dash != null,
        'DashManifestConfiguration should not be null!');
    this.config_ = config;
};

MyManifestParser.prototype.start = function (uri, playerInterface) {
    var type = shaka.net.NetworkingEngine.RequestType.MANIFEST;
    var request = {
        uris: [uri],
        method: 'GET',
        retryParameters: player.config_.manifest.retryParameters
    };
    return playerInterface.networkingEngine.request(type, request).promise
        .then(function (response) {
            return MyManifestParser.prototype.loadManifest_(response);
        });
};

MyManifestParser.prototype.stop = function () {
    return Promise.resolve();
};

MyManifestParser.prototype.configure = function () {
    console.log("Update!");
};


MyManifestParser.prototype.loadManifest_ = function (data) {
    // |data| is the response data from load(); but in this example, we ignore it.
    var manifest = shaka.dash.DashParser.prototype.parseManifest_(data.data);
    return manifest;
    return {
        presentationTimeline: {
            presentationStartTime: 1581770094,
            presentationDelay: 10,
            getDuration: function () { return 0 },
            getSeekRangeStart: function () { return 0 },
            getSeekRangeEnd: function () { return 0 },
            isLive: function () { return true },
            getSegmentAvailabilityEnd: function () { return 0 },
            segmentAvailabilityDuration: null,
            maxSegmentDuration: 1,
            minSegmentStartTime: 0,
            maxSegmentEndTime: null,
            clockOffset: 0,
            static: false,
            userSeekStart: 0,
            autoCorrectDrift: true
        },
        periods: [
            {
                startTime: 0,
                textStreams: [],
                variants: [
                    {
                        id: 3,
                        language: "und",
                        primary: false,
                        audio: null,
                        video: {
                            createSegmentIndex: function () { return 0 },
                            findSegmentPosition: function () { return 0 },
                            getSegmentReference: function () { return 0 },
                            id: 1,
                            originalId: 3,
                            initSegmentReference: {
                                startByte: 0,
                                endByte: null
                            },
                            presentationTimeOffset: 0,
                            mimeType: "video/webm",
                            codecs: "opus,vp8",
                            bandwidth: 0,
                            width: 1920,
                            height: 1080,
                            encrypted: false,
                            keyId: null,
                            language: "und",
                            label: null,
                            type: "video",
                            primary: false,
                            trickModeVideo: null,
                            emsgSchemeIdUris: [],
                            roles: [],
                            channelsCount: null,
                            audioSamplingRate: null,
                        },
                        bandwidth: 0,
                        drmInfos: [
                        ],
                        allowedByApplication: true,
                        allowedByKeySystem: true
                    }
                ]
            }
        ],
        offlineSessionIds: [],
        minBufferTime: 1
    }
};

// The arguments are only used for live.
// var timeline = new shaka.media.PresentationTimeline(1581684269, 0);

// return {
//     presentationTimeline: timeline,
//     periods: [{
//         startTime: 0,
//         textStreams: [],
//         variants: [{
//             id: 1,
//             video: {
//                 id: 1,
//                 createSegmentIndex: function () { return Promise.resolve(); },
//                 findSegmentPosition: function () { return Promise.resolve(); },
//                 getSegmentReference: function () { return Promise.resolve(); },
//                 mimeType: "video/webm",
//                 codecs: "opus,vp8",
//                 type: "video"
//             }
//         }]
//     }]
// };

//     presentationTimeline: timeline,
//     periods: [
//         {
//             startTime: 0,  // seconds, relative to presentation
//             variants: [
//                 {
//                     id: this.curId_++,  // globally unique ID
//                     language: 'en',
//                     primary: false,
//                     video: {
//                         id: this.curId_++,  // globally unique ID
//                         createSegmentIndex: function () { return Promise.resolve(); },
//                         findSegmentPosition: function () { return Promise.resolve(); },
//                         getSegmentReference: function () { return Promise.resolve(); },
//                         segmentIndex: 1,
//                         mimeType: 'video/webm',
//                         codecs: "opus,vp8",
//                         frameRate: undefined,
//                         bandwidth: 4000,  // bits/sec
//                         width: 640,
//                         height: 480,
//                         channelsCount: 2,
//                         encrypted: false,
//                         keyId: null,
//                         label: 'my_stream',
//                         type: "dynamic",
//                         primary: false,
//                         trickModeVideo: null,
//                         containsEmsgBoxes: false,
//                         roles: []
//                     },
//                     bandwidth: 8000,  // bits/sec, audio+video combined
//                     drmInfos: [],
//                     allowedByApplication: true,  // always initially true
//                     allowedByKeySystem: true   // always initially true
//                 }
//             ],
//             textStreams: [

//             ]
//         }
//     ]
// };
// };

MyManifestParser.prototype.loadPeriod_ = function (start) {
    return {
        startTime: start,  // seconds, relative to presentation
        variants: [
            this.loadVariant_(true, true),
            this.loadVariant_(true, false)
        ],
        textStreams: [
            this.loadStream_('text'),
            this.loadStream_('text')
        ]
    };
};

MyManifestParser.prototype.loadVariant_ = function (hasVideo, hasAudio) {
    console.assert(hasVideo || hasAudio);

    return {
        id: this.curId_++,  // globally unique ID
        language: 'en',
        primary: false,
        audio: hasAudio ? this.loadStream_('audio') : null,
        video: hasVideo ? this.loadStream_('video') : null,
        bandwidth: 8000,  // bits/sec, audio+video combined
        drmInfos: [],
        allowedByApplication: true,  // always initially true
        allowedByKeySystem: true   // always initially true
    };
};

MyManifestParser.prototype.loadStream_ = function (type) {
    var getUris = function () { return ['https://example.com/init']; };
    var initSegmentReference =
        new shaka.media.InitSegmentReference(getUris, 0, null);

    var index = new shaka.media.SegmentIndex([
        // Times are in seconds, relative to the presentation
        this.loadReference_(0, 0, 10),
        this.loadReference_(1, 10, 20),
        this.loadReference_(2, 20, 30),
    ]);

    return {
        id: this.curId_++,  // globally unique ID
        createSegmentIndex: function () { return Promise.resolve(); },
        segmentIndex: index,
        mimeType: type == 'video' ?
            'video/webm' : (type == 'audio' ? 'audio/webm' : 'text/vtt'),
        codecs: type == 'video' ? 'vp9' : (type == 'audio' ? 'vorbis' : ''),
        frameRate: type == 'video' ? 24 : undefined,
        bandwidth: 4000,  // bits/sec
        width: type == 'video' ? 640 : undefined,
        height: type == 'video' ? 480 : undefined,
        kind: type == 'text' ? 'subtitles' : undefined,
        channelsCount: type == 'audio' ? 2 : undefined,
        encrypted: false,
        keyId: null,
        language: 'en',
        label: 'my_stream',
        type: type,
        primary: false,
        trickModeVideo: null,
        containsEmsgBoxes: false,
        roles: []
    };
};

MyManifestParser.prototype.loadReference_ =
    function (position, start, end, initSegmentReference) {
        var getUris = function () { return ['https://example.com/ref_' + position]; };
        return new shaka.media.SegmentReference(
            position, start, end, getUris,
        /* startByte */ 0,
        /* endByte */ null,
            initSegmentReference,
        /* timestampOffset */ 0,
        /* appendWindowStart */ 0,
        /* appendWindowEnd */ Infinity);
    };