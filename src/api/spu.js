/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-08-17 10:02:16
 * @LastEditros:
 * @LastEditTime: 2021-08-18 09:36:46
 */
import request from '@/utils/request'

// SPU分类-添加
export function addCategroy(data) {
  return request({
    url: 'http://106.12.76.73:8081/admin/spu/category',
    method: 'post',
    data
  })
}

// SPU分类-列表
export function getCategoryList(params) {
  return request({
    url: 'http://106.12.76.73:8081/admin/spu/categories',
    method: 'get',
    params
  })
}

// SPU分类-删除
export function deleteCategoryById(id) {
  return request({
    url: `http://106.12.76.73:8081/admin/spu/category/${id}`,
    method: 'delete'
  })
}

// SPU分类-更新
export function editCategroy(data, id) {
  return request({
    url: `http://106.12.76.73:8081/admin/spu/category/${id}`,
    method: 'put',
    data
  })
}
