/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2021-08-28 08:08:15
 * @LastEditros: 
 * @LastEditTime: 2021-08-28 08:58:21
 */

/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-08-17 10:02:16
 * @LastEditros:
 * @LastEditTime: 2021-08-18 09:36:46
 */
import request from '@/utils/request';

// SPU分类-添加
export async function addCategroy(data: any) {
  return request('/admin/spu/category', {
    method: 'post',
    data
  })
}

// SPU分类-列表
export async function getCategoryList(params: any) {
  return request('/admin/spu/categories', {
    method: 'get',
    params
  })
}

// SPU分类-删除
export async function deleteCategoryById(id: any) {
  return request(`/admin/spu/category/${id}`, {
    method: 'delete',
  })
}

// SPU分类-更新

export async function editCategroy(data: any, id: string | number) {
  return request(`/admin/spu/category/${id}`, {
    method: 'put',
    data
  })
}
