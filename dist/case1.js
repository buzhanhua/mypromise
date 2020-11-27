const Promise = require('./bundle');
let p = new Promise((resolve, reject) => {
   setTimeout(() => {
        //throw '错误';
        resolve('成功');
        //reject('失败');
   }, 1000)
});

p.then((data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
        resolve(new Promise((resolve, reject) => {
            resolve(new Promise((resolve, reject) => {
                setTimeout(() => {
                    throw '错误';
                }, 1000)
            }))
        }))
    })
}, (err) => {
    console.log(err);
}).then((data) => {
    console.log(data, 1111);
}, (err) => {
    console.log(err, 2222);
})
