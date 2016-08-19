/**
 * Created by cavasblack on 16/8/18.
 */
"use strict"
const Worker = require("rsos").Worker
const pathToRegexp = require("path-to-regexp");
class RpcEngine {
    constructor(parent) {
        this.parent = parent;
    }

    init(fn) {
        fn()
    }

    listen(host, port, callback) {
        var worker = new Worker(_name, _servicepath, _opts);
        worker.listen(port, host);
        var self = this;
        worker.on("invoke", function (request, callback) {
            try {
                request = JSON.parse(request)
            } catch (e) {
                request = {};
            }
            var index = 0;
            var key = null;
            var params = {};
            while (index < self.parent.api.$schemas.length) {
                let item = self.parent.api.$schemas[index]
                var temp = pathToRegexp(item.key).exec([request.method, request.path].join(" "))
                if (temp != null) {
                    key = item.key;
                    var method = temp.slice(1)
                    item._pathTestRegExp.keys.forEach(function (item, index) {
                        params[item.name] = method[index]
                    });
                    break;
                }
                index++
            }
            self.parent.service.call("api.entry", {
                params: self.parent.utils.merge(request, params),
                schema: key
            }, function (err, result) {
                callback(null, JSON.stringify({error: err ? err.message : null, result: result ? result.params : null}))
            })
        });
        callback()
    }
}

let _name = null;

let _servicepath = null;

let _opts = null;

module.exports = function (name, servicepath, opts) {
    _name = name;
    _servicepath = servicepath;
    _opts = opts;
    return RpcEngine
};