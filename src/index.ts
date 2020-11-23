
const enum STATUS {
    pending = 'PENDING',
    fulfilled = "FULFILLED",
    rejected = 'REJECTED',
}

class Promise {
    public value: any;
    public reason: any;
    public status: STATUS;
    constructor(executor){
        this.value = undefined;
        this.reason = undefined;
        this.status = STATUS.pending;
        let resolve = (value?: unknown) => {
            // 表示只有pengding状态时， 才可以被改变状态
            if(this.status === STATUS.pending){
                this.value = value;
                this.status = STATUS.fulfilled;
            }
        }

        let reject = (reason?: unknown) => {
            if(this.status === STATUS.pending){
                this.reason = reason;
                this.status = STATUS.rejected;
            }
        }

        try{
            executor(resolve, reject);
        }catch (err){
            // 表示promise状态函数中抛错时， 状态变为rejected
            reject(err);
        }
    }

    then(){

    }
}

export default Promise;