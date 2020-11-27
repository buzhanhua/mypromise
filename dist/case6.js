const p = new Promise((resolve, reject) => {
    resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('ok');
        }, 1000)
    }));
})

p.then((data) => {
    console.log(data);
})