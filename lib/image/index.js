const debug = require('debug')('qcloud-sdk[auth]')
const http = require('axios')
const moment = require('moment')
const config = require('../../config')
const ImageDbService = require('../mysql/ImageDbService')
const sha1 = require('../helper/sha1')
const aesDecrypt = require('../helper/aesDecrypt')
const { ERRORS, LOGIN_STATE } = require('../constants')


/**
 * Koa 鉴权中间件
 * 基于 image 重新封装
 * @param {koa context} ctx koa 请求上下文
 * @return {Promise}
 */
function imageMiddleware (ctx, next) {
    return ImageDbService.saveImage(ctx.req).then(result => {
        ctx.state.$images = result
        return next()
    })
}


module.exports = {
    imageMiddleware
}
