import axios from "axios";

const instance = axios.create({//服务器地址
    baseURL: 'http://localhost:8081'
    // baseURL:'http://121.5.169.34:8086'
    // baseURL: ''
})
instance.interceptors.request.use(config => {//添加服务器验证令牌
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
})

function request(config) {
    return new Promise((resovle, reject) => {
        instance(config).then(res => {
            resovle(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export {request}
