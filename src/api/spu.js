/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-08-17 10:02:16
 * @LastEditros:
 * @LastEditTime: 2021-08-17 18:06:53
 */
import request from '@/utils/request'

// export function getCategroyLists(data) {
//   return request({
//     url: 'http://106.12.76.73:8081/admin/assist/login',
//     method: 'post',
//     data
//   })
// }

export function getCategoryList(params) {
  return request({
    url: 'http://106.12.76.73:8081/admin/spu/categories',
    method: 'get',
    params
  })
}

export function deleteCategoryById(id) {
  return request({
    url: `http://106.12.76.73:8081/admin/spu/category/${id}`,
    method: 'delete'
  })
}
