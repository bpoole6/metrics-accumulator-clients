// const prom = require("prom-client")
import {Registry} from "prom-client"
import axios from "axios/index";
import {AxiosResponse} from "axios";

export class ClientResponse {
    public request_response: AxiosResponse;
    public statusCode: number;
    public content: string;

    constructor(request_response: AxiosResponse) {
        this.request_response = request_response
        this.statusCode = request_response.status
        this.content = request_response.data
    }
}

export class Client {
    private url: string;
    private xApiKey: string;

    constructor(url: string, xApiKey: string) {
        if (url === null || url.trim() === "") {
            throw new Error("url cannot be empty or blank")
        }
        this.url = url;
        this.xApiKey = xApiKey;
    }

    updateMetrics(metricGroup: string, registry: Registry): Promise<ClientResponse> {
        return axios({
            url: `${this.url}/update/${metricGroup}`,
            headers: {"Content-Type": "text/plain", "x-api-key": this.xApiKey},
            method: 'POST',
            data: registry.metrics()
        }).then((res: AxiosResponse) => {
            return new Promise((resolve, reject) => {
                resolve(new ClientResponse(res))
            })
        });
    }

    getMetricGroup(metricGroup: string): Promise<ClientResponse> {
        return axios({
            url: `${this.url}/metrics/${metricGroup}`,
            method: 'GET',
        }).then((res: AxiosResponse) => {
            return new Promise((resolve, reject) => {
                resolve(new ClientResponse(res))
            })
        });
    }

    reloadConfigurations(): Promise<ClientResponse> {
        return axios({
            url: `${this.url}/reload-configuration`,
            method: 'PUT',
        }).then((res: AxiosResponse) => {
            return new Promise((resolve, reject) => {
                resolve(new ClientResponse(res))
            })
        });
    }

    resetMetricGroup(metricGroup: string): Promise<ClientResponse> {
        return axios({
            url: `${this.url}/reset-metric-group/${metricGroup}`,
            method: 'PUT',
        }).then((res: AxiosResponse) => {
            return new Promise((resolve, reject) => {
                resolve(new ClientResponse(res))
            })
        });
    }

    serviceDiscovery(): Promise<ClientResponse> {
        return axios({
            url: `${this.url}/service-discovery`,
            method: 'GET',
        }).then((res: AxiosResponse) => {
            return new Promise((resolve, reject) => {
                resolve(new ClientResponse(res))
            })
        });
    }

    currentConfigurations(): Promise<ClientResponse> {
        return axios({
            url: `${this.url}/current-configurations`,
            method: 'GET',
        }).then((res: AxiosResponse) => {
            return new Promise((resolve, reject) => {
                resolve(new ClientResponse(res))
            })
        });
    }

    stripForwardSlash(s: string): string {
        if (s == null || s.charAt(s.length - 1) != '/') {
            return s;
        }
        return this.stripForwardSlash(s.substring(0, s.length - 1));
    }
}



