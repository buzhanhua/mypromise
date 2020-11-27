const fs = require('fs');
const Promise = require('./bundle');

//将传入的node api转换为promise API
function promisify(fn){
    return function(...args){
        return new Promise((resolve, reject) => {
            fn(...args, (err, data) => {
                if(err) reject(err);
                resolve(data);
            })
        })
    }
}

let read = promisify(fs.readFile);

read('./name.txt','utf8').then((data) => {
    console.log(data);
});

function isPromise(value){
    if((typeof value === 'object' && value !== null) || typeof value === 'function'){
        if(typeof value.then === 'function'){
            return true;
        }
    }
    return false;
}

Promise.all = function(values){
    return new Promise((resolve, reject) => {
        let result = [];
        let time = 0;
        function collectResult(v,i){
            result[i] = v;
            if(++time === values.length){
                resolve(result);
            }
        }
        for(let i = 0; i < values.length ;i++){
            let value = values[i];
            if(isPromise(value)){
                value.then((y) => {
                    collectResult(y,i)
                }, reject);
            }else{
                collectResult(value,i);
            }
        }
    });
}

Promise.all([read('./name.txt','utf8'),read('./age.txt','utf8'),9]).then((data) => {
    console.log(data)
})

