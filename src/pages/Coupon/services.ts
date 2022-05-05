import request from '@/utils/request';
import {PageParams} from "@/utils/request/params";

// 优惠券-列表
export function getCouponList(params: PageParams) {
  return request('/admin/merchant/coupon', {
    method: 'get',
    params
  })
}

// 优惠券-添加
export function addCoupon(data: any) {
  return request('/admin/merchant/coupon', {
    method: 'post',
    data
  })
}

// 优惠券-删除
export function delCoupon(id: string) {
  return request(`/admin/merchant/coupon/${id}`, {
    method: 'Delete',
  })
}
