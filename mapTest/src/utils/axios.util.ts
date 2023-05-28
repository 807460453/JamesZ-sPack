import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";


export function getReq(url: string, method?: string, params?: any): Promise<AxiosResponse<any, any>>
export function getReq(cfg: AxiosRequestConfig): Promise<AxiosResponse<any, any>>

export function getReq(cfg: AxiosRequestConfig | string, method: string = 'get', params?: any) {
    let req
    if (typeof cfg === 'string') {
        const config: AxiosRequestConfig = { url: cfg, method }
        if (params) {

            const p: keyof AxiosRequestConfig = ['PUT', 'POST', 'DELETE', 'PATCH', 'put', 'post', 'delete', 'patch'].includes(method) ? 'data' : 'params'
            config[p] = params
            // if (method && ['PUT', 'POST', 'DELETE', 'PATCH', 'put', 'post', 'delete', 'patch'].includes(method)) {
            //     config.data = params
            // } else {
            //     config.params = params
            // }
        }
        req = axios.request(config)
    } else {
        req = axios.request(cfg)
    }
    return req?.then(res => res.data)
}
// export function getReq(url: string) {
//     const cfg = { url }
//     return getReq(cfg)
// }