const fs  = require('fs');
const path = require('path');
let events = {
    arr: [],
    on(fn){
        this.arr.push(fn);
    },
    emit(){
        this.arr.forEach(fn => fn());
    }
}
let obj: any = {};
events.on(() => {
    console.log('我执行了');
})
events.on(() => {
    if(Object.keys(obj).length === 2){
        console.log(obj);
    }
})

fs.readFile(path.resolve(__dirname, './name.txt'),'utf-8', (err, data) => {
    obj.name = data;
    events.emit();
})

fs.readFile(path.resolve(__dirname, './age.txt'),'utf-8', (err, data) => {
    obj.age = data;
    events.emit();
})
