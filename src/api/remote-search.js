/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2020-09-07 21:46:05
 * @LastEditros:
 * @LastEditTime: 2021-08-12 16:02:01
 */
import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}
