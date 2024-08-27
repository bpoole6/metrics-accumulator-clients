"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.ClientResponse = void 0;
var axios_1 = require("axios");
var ClientResponse = /** @class */ (function () {
    function ClientResponse(request_response) {
        this.request_response = request_response;
        this.statusCode = request_response.status;
        this.content = request_response.data;
    }
    return ClientResponse;
}());
exports.ClientResponse = ClientResponse;
var Client = /** @class */ (function () {
    function Client(url, xApiKey) {
        if (url === null || url.trim() === "") {
            throw new Error("url cannot be empty or blank");
        }
        this.url = this.stripForwardSlash(url);
        this.xApiKey = xApiKey;
    }
    Client.prototype.updateMetrics = function (metricGroup, registry) {
        return (0, axios_1.default)({
            url: "".concat(this.url, "/update/").concat(metricGroup),
            headers: { "Content-Type": "text/plain", "x-api-key": this.xApiKey },
            method: 'POST',
            data: registry.metrics()
        }).then(function (res) {
            return new Promise(function (resolve, reject) {
                resolve(new ClientResponse(res));
            });
        });
    };
    Client.prototype.getMetricGroup = function (metricGroup) {
        return (0, axios_1.default)({
            url: "".concat(this.url, "/metrics/").concat(metricGroup),
            method: 'GET',
        }).then(function (res) {
            return new Promise(function (resolve, reject) {
                resolve(new ClientResponse(res));
            });
        });
    };
    Client.prototype.reloadConfigurations = function () {
        return (0, axios_1.default)({
            url: "".concat(this.url, "/reload-configuration"),
            method: 'PUT',
        }).then(function (res) {
            return new Promise(function (resolve, reject) {
                resolve(new ClientResponse(res));
            });
        });
    };
    Client.prototype.resetMetricGroup = function (metricGroup) {
        return (0, axios_1.default)({
            url: "".concat(this.url, "/reset-metric-group/").concat(metricGroup),
            method: 'PUT',
        }).then(function (res) {
            return new Promise(function (resolve, reject) {
                resolve(new ClientResponse(res));
            });
        });
    };
    Client.prototype.serviceDiscovery = function () {
        return (0, axios_1.default)({
            url: "".concat(this.url, "/service-discovery"),
            method: 'GET',
        }).then(function (res) {
            return new Promise(function (resolve, reject) {
                resolve(new ClientResponse(res));
            });
        });
    };
    Client.prototype.currentConfigurations = function () {
        return (0, axios_1.default)({
            url: "".concat(this.url, "/current-configurations"),
            method: 'GET',
        }).then(function (res) {
            return new Promise(function (resolve, reject) {
                resolve(new ClientResponse(res));
            });
        });
    };
    Client.prototype.stripForwardSlash = function (s) {
        if (s == null || s.charAt(s.length - 1) != '/') {
            return s;
        }
        return this.stripForwardSlash(s.substring(0, s.length - 1));
    };
    return Client;
}());
exports.Client = Client;
