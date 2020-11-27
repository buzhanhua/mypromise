const Promise = require('./bundle');

const p = new Promise((resolve, reject) => {
    reject('失败')
});

p.catch((err) => {
    console.log(err);
    return 11
}).then((data) => {
    console.log(data);
})