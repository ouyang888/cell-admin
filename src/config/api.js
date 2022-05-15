const admin_dev = '/dms/'

const admin_test ='https://changhejiaju.com.cn/dms'

const admin_uat = 'http://120.24.82.198:8808'

const admin_pro = 'http://120.24.82.198:8808'

let local = 'test'

switch (location.hostname) {
    case 'localhost':
        local = 'dev';
        break;
    case 'devnewdota.smartmidea.net':
        local = 'test';
        if(location.href.indexOf('https://devnewdota.smartmidea.net/static/inspectionClient-uat/') > -1) {
            local = 'uat';
        }
        break;
    default: 
        local = 'prod';
}

console.log(local)
const api = {
    dev: {
        adminUrl: admin_dev,
    },
    test: {
        adminUrl: admin_test,
    },
    uat: {
        adminUrl: admin_uat,
    },
    prod: {
        adminUrl: admin_pro,
    }
}
console.log(api[local],"api[local]");
export default api[local];