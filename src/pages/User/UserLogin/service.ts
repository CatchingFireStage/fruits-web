/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2020-12-22 17:47:17
 * @LastEditros: 
 * @LastEditTime: 2021-08-18 18:22:51
 */
import request from '@/utils/request';
import { FormDataType } from './index';

export async function login(params: FormDataType) {
  return request('/admin/assist/login', {
    method: 'POST',
    data: params,
  });
}
