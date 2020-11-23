
type CallbackFn = () => void;
type ReturnFn = (...args: any[]) => void;

// 表示扩展的是全局上的Function 

    interface Function {
        before: (fn: CallbackFn) => ReturnFn;
    }


Function.prototype.before = function(fn){
    return () => {
        fn();
        this();
    }
}

function core(){
    // do something
    console.log('我是核心方法');
}

let before = core.before(() => {
    console.log('我在前面执行');
})

before();

