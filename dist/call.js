Function.prototype.myCall = function(target = global){
    // 默认是window， 挂载方法
    target.fn = this;
    // 调用和传参
    let result = target.fn(...Array.from(arguments).slice(1));
    // 删除属性
    delete target.fn;
    return result;
}

function fn1(){
    console.log(111);
}

function fn2(){
    console.log(2222, this.age)
}
let obj = {
    age: 12
}

fn1.myCall.myCall(fn2, obj)