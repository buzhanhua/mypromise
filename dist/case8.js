const Promise = require('./bundle');
new Promise((resolve, reject) => {
    resolve(new Promise((res,rej) => {
        setTimeout(() => {
            res(new Promise((re,rj) => {
                setTimeout(() => {
                    re('s')
                }, 2000)
            }))
        }, 2000)
    }))
}).then((data) => {
    console.log(data)
}, (err) => {
    console.log(err);
})