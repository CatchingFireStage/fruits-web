/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-08-28 08:08:15
 * @LastEditros:
 * @LastEditTime: 2021-12-09 17:20:38
 */

import request from '@/utils/request';
import { PageParams } from '@/utils/request/params';
import { message } from 'antd';
import { SpecificationTableData, SpuListTableData } from './spu.dto';

// SPU分类-添加
export function payList(params: any) {
  return request('/admin/finance/pay', {
    method: 'get',
    params,
  });
}

export function detail(id: any) {
  return request(`/admin/finance/pay/${id}`, {
    method: 'get',
  });
}

export function refundList(params: any) {
  return request('/admin/finance/refund', {
    method: 'get',
    params,
  });
}

export function refundById(data: any) {
  return request('/admin/finance/refund', {
    method: 'POST',
    data,
  });
}
