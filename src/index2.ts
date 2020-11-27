
const enum STATUS {
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}

function resolvePromise(promise2, x, resolve, reject){
    if(promise2 === x){
        throw new TypeError('出错了');
    }

    if((typeof x === 'object' && x !== null) || typeof x === 'function'){
        let isCalled = false;
        try{
            let then = x.then;
            if(typeof then === 'function'){
                then.call(x, (y) => {
                    if(isCalled) return;
                    isCalled = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, (r) => {
                    if(isCalled) return;
                    isCalled = true;
                    reject(r);
                })
            }else{
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
    public status: STATUS;
    public value: any;
    public reason: any;
    public onFulFillList: Function[];
    public onRejectList: Function[];
    static deferred;
    constructor(executor){
        this.status = STATUS.pending;
        this.value = undefined;
        this.reason = undefined;
        this.onFulFillList = [];
        this.onRejectList = [];

        let resolve = (value?: unknown) => {
            if(this.status === STATUS.pending){
                this.value = value;
                this.status = STATUS.fulfilled;
                this.onFulFillList.forEach(fn => fn(this.value));
            }
        }
        let reject = (reason?: unknown) => {
            if(this.status === STATUS.pending){
                this.reason = reason;
                this.status = STATUS.rejected;
                this.onRejectList.forEach(fn => fn(this.reason));
            }
        }
        try{
            executor(resolve, reject);
        }catch(err){
            reject(err);
        }
    }

    then(onFulFilled, onRejected){
        onFulFilled = typeof onFulFilled === 'function'? onFulFilled : val => val;
        onRejected = typeof onRejected === 'function'? onRejected : err => { throw err };
        let promise2 = new Promise((resolve, reject) => {
            if(this.status === STATUS.fulfilled){
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
                        let x = onRejected(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(err){
                        reject(err);
                    }
                }, 0);
            }
            if(this.status === STATUS.pending){
                this.onFulFillList.push(() => {
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
                            let x = onRejected(this.value);
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
}

Promise.deferred = function(){
    let def = {} as any;
    def.promise = new Promise((resolve,  reject) => {
        def.resolve = resolve;
        def.reject = reject;
    });
    return def;
}
export default Promise