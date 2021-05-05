/*
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2021-03-19 14:32:40
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-03-19 14:39:29
 */
import request from '@/utils/request'

export function getInList(data) {
  return request({
    url: '/common/getInList',
    method: 'post',
    data
  })
}
