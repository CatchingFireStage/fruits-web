import request from '@/utils/request';
import { DetailInfo } from './spu.dto';

// 支付列表
export function payList(params: any) {
  return request('/admin/finance/pay', {
    method: 'get',
    params,
  });
}

// 支付详情
export function detail(
  id: string,
): Promise<{ data: DetailInfo; code: number }> {
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
export function reiterateRefund(id: any) {
  return request(`/admin​/finance​/reiterateRefund​/${id}`, {
    method: 'PUT',
  });
}

/**
 * @desc 手动检查是否支付成功
 * @param id {订单id}
 * @returns
 */
export function checkOrderResult(id: string) {
  return request(`/admin/finance/pay/${id}/checkIsPay`, {
    method: 'GET',
  });
}
