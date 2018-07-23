'use strict';

angular.module('pureSpectrumApp').factory('config', function Config() {
    var env = (function () {
        var url = window.document.URL;

        if (url.indexOf('http://127.0.0.1') === 0 || url.indexOf('http://localhost') === 0 || url.indexOf('http://dev.spectrumsurveys.com') === 0) {
            return 'development';
        }

        if (url.indexOf('http://staging.spectrumsurveys.com') === 0) {
            return 'staging';
        }

        if (url.indexOf('http://uat.spectrumsurveys.com') === 0) {
            return 'uat';
        }

        if (url.indexOf('https://platform.purespectrum.com') === 0 || url.indexOf('http://platform.purespectrum.com') === 0) {
            return 'production';
        }

    })();

    if (!env) {
        throw new Error('failed to detect application env');
    }

    return window.config[env];
});
