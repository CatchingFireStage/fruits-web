/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-08-28 08:08:15
 * @LastEditros:
 * @LastEditTime: 2021-12-29 10:46:05
 */

import request from '@/utils/request';

// 支付列表
export function payList(params: any) {
  return request('/admin/finance/pay', {
    method: 'get',
    params,
  });
}

// 支付详情
export function detail(id: any) {
  return request(`/admin/finance/pay/${id}`, {
    method: 'get',
  });
}

// 退款列表
export function refundList(params: any) {
  return request('/admin/finance/refund', {
    method: 'get',
    params,
  });
}

// 退款
export function refundById(data: any) {
  return request('/admin/finance/refund', {
    method: 'POST',
    data,
  });
}

// 重新退款
export function reiterateRefund​(id: any) {
  return request(`/admin​/finance​/reiterateRefund​/${id}`, {
    method: 'PUT',
  });
}