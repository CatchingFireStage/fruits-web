/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2020-09-07 21:46:05
 * @LastEditros:
 * @LastEditTime: 2021-08-12 14:52:27
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://106.12.76.73:8081/admin/assist/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/dev-api/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/dev-api/vue-element-admin/user/logout',
    method: 'post'
  })
}
