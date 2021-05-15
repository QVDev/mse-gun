function MyManifestParser() {
    this.curId_ = 0;
    this.config_ = null;
}

MyManifestParser.prototype.configure = function (config) {
    this.config_ = config;
    shaka.dash.DashParser.prototype.configure(config)
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
            var manifest = shaka.dash.DashParser.prototype.parseManifest_(response.data);
            return manifest;            
        });
};

MyManifestParser.prototype.stop = function () {
    return Promise.resolve();
};

