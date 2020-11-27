const Promise = require('./bundle');
new Promise((resolve, reject) => {
    resolve(1111);
}).finally(() => {
    return new Promise((res,rej) => {
        setTimeout(() => {
            rej('失败');
        }, 2000)
    });
}).then((data) => {
    console.log(data) // 1111
}).catch((err) => {
    console.log(err);
})