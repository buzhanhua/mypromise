const fs = require('fs');
const Promise = require('./bundle.js');
// function read(path){
//     return new Promise((resolve, reject) => {
//         fs.readFile(path, 'utf8', (err, data) => {
//             if(err) reject(err);
//             resolve(data);
//         })
//     })
// }

// function read(path){
//     // 使用延迟对象减少一层嵌套
//    let deferred = Promise.deferred()
//     fs.readFile(path, 'utf8', (err, data) => {
//         if(err) deferred.reject(err);
//         deferred.resolve(data);
//     })
//     return deferred.promise;
// }

read('./name.txt').then((data) => {
    return read('./age.txt');
}).then((data) => {
    console.log(data);
})
