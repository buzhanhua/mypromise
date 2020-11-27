function wrap(p1){
    let abort;
    let p2 = new Promise((resolve, reject) => {
        abort = reject;
    });
    let p3 = Promise.race([p1,p2]);
    p3.abort = abort;
    return p3;
}

let p = wrap(new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功');
    }, 3000)
}));
p.then((data) => {
    console.log(data);
}, (err) => {
    console.log(err);
});

setTimeout(() => {
    p.abort('超时了');
}, 4000)