new Promise((resolve, reject) => {
    resolve(111);
}).finally((data) => {
    console.log(data);
    return Promise.reject(3333);
}).then((data) => {
    console.log(data);
}, (err) => {
    console.log(err);
});