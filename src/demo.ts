const fs = require('fs');

function read(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if(err) reject(err);
            resolve(data);
        })
    })
}

read('./name.txt').then((data) => {
    return read('./age.txt');
}).then((data) => {
    console.log(data);
})

export {}