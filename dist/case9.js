const Promise = require('./bundle');

Promise.resolve(Promise.reject(11)).then((data) => {
    console.log(data)
}).catch((err) => {
    console.log(err,3);
})