const debug = require('debug')('qcloud-sdk[AuthDbService]')
const uuidGenerator = require('uuid/v4')
const moment = require('moment')
const ERRORS = require('../constants').ERRORS
const mysql = require('./index')

/**
 * 储存用户信息
 * @param {object} Image
 * @return {Promise}
 */
function saveImage (req) {
    const uuid = uuidGenerator()
    const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    const { 'image': image } = req.headers
    const name = image.name
    const open_id = image.open_id
    const img_url = image.img_url
    const size = image.size

    // 查重并决定是插入还是更新数据
    return mysql('cImage').count('name as hasImage').where({
        name
    })
    .then(res => {
        // 如果存在用户则更新
        if (res[0].hasImage) {
            return mysql('cImage').update({
                uuid, open_id, img_url, name, size, create_time
            }).where({
                name
            })
        } else {
            return mysql('cImage').insert({
                uuid, open_id, img_url, name, size, create_time
            })
        }
    })
    .then(() => ({
        uuid, open_id, img_url, name, size, create_time
    }))
    .catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB, e)
        throw new Error(`${ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB}\n${e}`)
    })
}

/**
 * 通过 open_id 获取图片信息
 * @param {string} open_id 登录时颁发的 open_id 为登录态标识
 */
function getImageByOpenId (open_id) {
    if (!skey) throw new Error(ERRORS.DBERR.ERR_NO_SKEY_ON_CALL_GETImageFUNCTION)

    return mysql('cImage').select('*').where({
      open_id
    })
}

module.exports = {
    saveImage,
    getImageByOpenId
}