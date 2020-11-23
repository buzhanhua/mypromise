
function currying(fn){
    let exec = (sumArgs: any[]) => {
        return sumArgs.length >= fn.length ? fn(...sumArgs) : (...args) => exec([...sumArgs, ...args]); 
    };
    return exec([]);
}
function isType(type: string, target: any) {
    return Object.prototype.toString.call(target) === `[object ${type}]`;
}

let isString = currying(isType)('String');
console.log(isString('ssss'));

function  sum(a,b,c,d,e) {
    return a + b + c + d + e;
}

console.log(currying(sum)(1)(2,3)(4)(5));

function curry(fn){
    let exec = (sumArgs) => {
        return sumArgs.length >= fn.length ? fn(sumArgs) : (...args) => exec([...sumArgs,...args])
    }

    return exec([]);
}