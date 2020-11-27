const fs = require('fs').promises;
// const Promise = require('./bundle');
Promise.allSettled([
    fs.readFile('./name.txt','utf8'),
    fs.readFile('./age.txt','utf8')
]).then((data) => {
    console.log(data);
}, (err) => {
    console.log(err);
})