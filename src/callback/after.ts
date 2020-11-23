const fs  = require('fs');
const path = require('path');

function after(time, callback){
    return function(){
        if(--time === 0){
            callback();
        }
    }
}

let obj = {} as any;
let fn = after(2, () => {
    console.log(obj);
})

fs.readFile(path.resolve(__dirname, './name.txt'),'utf-8', (err, data) => {
    obj.name = data;
    fn();
})

fs.readFile(path.resolve(__dirname, './age.txt'),'utf-8', (err, data) => {
    obj.age = data;
    fn();
});
 
export {}

