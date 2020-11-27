
const enum STATUS { // 存放所有的状态
    pending = 'PENDING',
    fulfilled = "FULFILLED",
    rejected = 'REJECTED',
}
function isPromise(value){
    if((typeof value === 'object' && value !== null) || typeof value === 'function'){
        if(typeof value.then === 'function'){
            return true;
        }
    }
    return false;
}
// 该方法用于解析then返回的promise的状态
function resolvePromise(promise2, x, resolve, reject){
    // 防止出现 p1.then(() => p1); 的情况出现， 这种是不合理的， 自己等待自己的状态
    if(x === promise2){
        throw new TypeError('出错了 ');
    }

    if((typeof x === 'object' && x !== null) || typeof x === 'function'){
        // 只有对象或者函数才可能是promise
        let isCalled = false; // 表示没有调用过成功和失败， 因为别人的promise.then 方法中可能有可能 onFulFilled, onRejected 出现都执行的情况
                              // 会导致， 我们的promise在改变状态后再次改变， 这样是不合理的
                              // 我们的promise用isCalled控制， then的成功或者失败只调用一次。
        try{
            let then = x.then;
            if(typeof then === 'function'){
                // 如果是x是promise， 会在x.then的回调函数中获取， resolve或者 reject 的值
                then.call(x, (y) => {
                    if(isCalled) return;
                    isCalled = true;
                    // y 可能还是一个promise， 递归解析y 直到它是普通值为止。
                    resolvePromise(promise2, y, resolve, reject);
                }, (r) => {
                    if(isCalled) return;
                    isCalled = true;
                    reject(r);
                })
            }else{
                //普通对象
                resolve(x);
            }
        }catch(err){
            if(isCalled) return;
            isCalled = true;
            reject(err);
        }
    }else{
        resolve(x);
    }
}

class Promise {
    public value: any;
    public reason: any;
    public status: STATUS;
    public onFulFillList: Function[];
    public onRejectList: Function[];
    static deferred;
    static all;
    static race;
    static resolve;
    static reject;
    static allSettled;
    constructor(executor){
        this.value = undefined;
        this.reason = undefined;
        // promise 是控制状态的，resolve reject throw xxx 有其一就会改变状态，而其余两种方式则不会执行，
        // 但是并不会阻塞代码， 举个 🌰 子
        // new Promise((resolve, reject) => {
        //      console.log(1);
        //      resolve();
        //      console.log(2);
        // })
        // 1 2 
        this.status = STATUS.pending;
        // 用于做异步缓存， 里面的方法用于改变 then 返回的promise的状态
        // 为什么是数组 ？ 因为一个promise的他很方法可以被调用多次， 切要求按照原始的顺序执行
        this.onFulFillList = [];
        this.onRejectList = [];
        let resolve = (value?: unknown) => {
            if(value instanceof Promise){ 
                // 判断resolve中接受的是不是自己的promise （规范规定不考虑别人的）， 如果是则等待结果并返回
                // reject 则无此判断直接返回
                return value.then(resolve,reject);
            }
            // 表示只有pengding状态时， 才可以被改变状态
            if(this.status === STATUS.pending){
                this.value = value;
                this.status = STATUS.fulfilled;
                // 发布
                this.onFulFillList.forEach((fn) => fn(this.value));
            }
        }

        let reject = (reason?: unknown) => {
            if(this.status === STATUS.pending){
                this.reason = reason;
                this.status = STATUS.rejected;
                this.onRejectList.forEach((fn) => fn(this.reason));
            }
        }

        try{
            // 立即执行状态函数
            executor(resolve, reject);
        }catch (err){
            // 表示promise状态函数中抛错时， 状态变为rejected
            reject(err);
        }
    }

    then(onFulFilled, onRejected){
        onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : (value) => value;
        onRejected = typeof onRejected === 'function' ? onRejected : (err) => { throw err };
        // 保证每次then 返回的都是一个新的promise， 如果不是这样， 多次调用then会改变这个promise 的状态， 不合理。
        let promise2 = new Promise((resolve,reject) => {
            if(this.status === STATUS.fulfilled){
                // promise A+规范要求， onFulFilled, onRejected 不能在当前执行上下文中执行， 这里需要使用宏任务或者为微任务延迟执行。
                setTimeout(() => {
                    try{
                        let x = onFulFilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(err){
                        reject(err);
                    }
                }, 0);
            }
            if(this.status === STATUS.rejected){
                setTimeout(() => {
                    try{
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(err){
                        reject(err);
                    }
                }, 0);
            }
            if(this.status === STATUS.pending){
                // 订阅
                this.onFulFillList.push(() => { // 函数切片
                    setTimeout(() => {
                        try{
                            let x = onFulFilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        }catch(err){
                            reject(err);
                        }
                    }, 0);
                });
                this.onRejectList.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        }catch(err){
                            reject(err);
                        }
                    }, 0);
                });
            }
        });

        return promise2;
    }

    catch(onRejected){
        // catch 是 then 的语法糖， 成功的值还是可以穿透的
        return this.then(null, onRejected);
    }

    finally(callback){
        // 1. 无论上个promise成功或者失败都会执行finally 的callback
        // 2. Promise.resolve(callback()) 为成功态时， 传递上个promise的value和reason
        // 3. Promise.resolve(callback()) 为失败态时， 使用自己的错误原因。
        return this.then((data) => {
            return Promise.resolve(callback()).then(data => data);
        }, (err) => {
            return Promise.resolve(callback()).then(err => { throw err });
        })
    }
}

Promise.deferred = function(){
    let defer = {} as any;
    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
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

Promise.race = function(values){
    // 接受一组promise ， 采用最先执行完的promise的状态
    return new Promise((resolve, reject) => {
        for(let i = 0 ; i < values.length ; i++){
            let value = values[i];
            if(isPromise(value)){
                value.then(resolve, reject);
            }else{
                Promise.resolve(value).then(resolve, reject);
            }
        }
    })
}

Promise.resolve = function (value){
    //当value为promise时， 返回的promise不一定时成功态， 要看value的状态
    return new Promise((resolve, reject) => {
        resolve(value);
    })
}

Promise.reject = function(reason){
    return new Promise((resolve, reject) => {
        reject(reason);
    })
}

Promise.allSettled = function (values) {
    return new Promise((resolve, reject) => {
        let time = 0;
        let arr = [];
        function collectResult(v, i){
            if(++time === values){
                resolve(arr);
            }
        }
        for(let i = 0 ; i < values.length ; i++){
            let value = values[i];
            if(isPromise(value)){
                value.then((data) => {
                    collectResult({ value: data, stauts: 'fulfilled' }, i); 
                }, (err) => {
                    collectResult({ value: err, stauts: 'rejected' }, i); 
                });
            }else{
                collectResult({ value, stauts: 'fulfilled' }, i);                
            }
        }
    });
}



export default Promise;