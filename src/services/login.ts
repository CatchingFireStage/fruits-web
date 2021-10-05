/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2020-12-22 17:47:17
 * @LastEditros: 
 * @LastEditTime: 2021-08-18 18:13:48
 */
import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
}

export async function login(data: LoginParamsType) {
  return request('/api/login/account', {
    method: 'POST',
    data
  });
}
