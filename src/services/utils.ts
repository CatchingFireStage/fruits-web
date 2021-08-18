/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2020-12-22 17:47:17
 * @LastEditros: 
 * @LastEditTime: 2021-04-29 11:17:52
 */
import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function getCosSetting() {
  return request('/api/common/getTempKeys', {
    method: 'POST',
  });
}


export async function getMenu () {
  return request('/api/admin/userMenu', {
    method: 'GET',
  });
}


// 批量上传excel文件
export async function importMaterial (data: any) {
  return request('/api/admin/room/importMaterial', {
    method: 'POST',
    data
  });
}


