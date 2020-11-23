'use strict';

var Promise = /** @class */ (function () {
    function Promise(executor) {
        var _this = this;
        this.value = undefined;
        this.reason = undefined;
        this.status = "PENDING" /* pending */;
        var resolve = function (value) {
            // 表示只有pengding状态时， 才可以被改变状态
            if (_this.status === "PENDING" /* pending */) {
                _this.value = value;
                _this.status = "FULFILLED" /* fulfilled */;
            }
        };
        var reject = function (reason) {
            if (_this.status === "PENDING" /* pending */) {
                _this.reason = reason;
                _this.status = "REJECTED" /* rejected */;
            }
        };
        try {
            executor(resolve, reject);
        }
        catch (err) {
            // 表示promise状态函数中抛错时， 状态变为rejected
            reject(err);
        }
    }
    Promise.prototype.then = function () {
    };
    return Promise;
}());

module.exports = Promise;
