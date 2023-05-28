import Mock, { type MockjsRequestOptions } from "mockjs";
import type { App, Plugin } from "vue";
import { preUrl } from "@/utils/config.util";

interface Fncfg {
    [key: string]: Function
}


const fnCfg: Fncfg = {
    '/getKey': (params: { auth: string }) => params.auth === 'James_here_give_me_the_key' ? 'Aluvei0uUnhgix63ozMFJSnyZvCIlBnoVl53rss6f89zLuKpA7xHypHzLmG56PHf' : 'Guards!!!'
}

function getParamsFromUrl(url: string) {
    const params: any = {}
    if (url.indexOf('?') !== -1) {
        const pureArgs = url.split('?')[1]
        const sp = new URLSearchParams(pureArgs)
        for (const [k, v] of sp.entries()) {
            params[k] = v
        }
    }
    return params
}

function getMockFn(fn: Function) {
    return function (options: MockjsRequestOptions) {
        const params = getParamsFromUrl(options.url)
        return fn(Object.assign(params, options.body))
    }
}

function setMock(url: string, fn: Function) {
    Mock.mock(new RegExp(preUrl + url), getMockFn(fn))
    // Mock.mock(preUrl + url, getMockFn(fn))
}



const mockPlgn: Plugin = {
    install(app: App<Element>, options: any) {
        for (const key in fnCfg) {
            if (Object.prototype.hasOwnProperty.call(fnCfg, key)) {
                const fn: Function = fnCfg[key];
                setMock(key, fn)
            }
        }
    }
}

export default mockPlgn