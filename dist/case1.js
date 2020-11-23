let p = new Promise((resolve, reject) => {
    throw '错误';
    resolve('成功');
    reject('失败');
});

p.then((data) => {
    console.log(data);
}, (err) => {
    console.log(err);
});