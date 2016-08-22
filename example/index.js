/**
 * Created by cavasblack on 16/8/18.
 */
const Hojs = require("hojs")

const $ = new Hojs({
    path: __dirname,
    engine: require("../lib")("myname", "/tuling-rsos/mydemoservice", {connect: "localhost:2181"})
})

$.api.get("/get/:aaaa")
    .param("msg", {
        type: "TrimString",
        default: "没有参数",
        coment: "消息内容"
    })
    .param("aaaa", {
        type: "TrimString"
    })
    .required("msg")
    .register(function (params, callback) {
        callback(null, params)
    })

$.initAndListen("localhost", 6668, function (err) {
    if (err) {
        process.exit(1)
    } else {
        console.log("service start")
    }
})