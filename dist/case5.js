const Promise = require('./bundle');

new Promise((resolve, reject) => {
    resolve(1);
})
.then((res) => 2)
.catch((err) => 3)
.then((res) => console.log(res));