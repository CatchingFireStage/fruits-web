/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-08-28 08:08:15
 * @LastEditros:
 * @LastEditTime: 2021-10-18 16:51:03
 */

import request from '@/utils/request';
import { message } from 'antd';

/**
 * 订单-制作完成
 * @param id {number}
 * @returns
 */
export async function orderFulfill(id: number, callBack: () => void) {
  let res = await request(`/admin/order/orderFulfill/${id}`, {
    method: 'PATCH',
  });
  if (res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack();
    });
  }
}

/**
 * 订单-已经送达
 * @param id {number}
 * @param callBack
 */
export async function orderDelivery(id: number, callBack: () => void) {
  let res = await request(`/admin/order/orderDelivery/${id}`, {
    method: 'PATCH',
  });
  if (res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack();
    });
  }
}

export async function orderHistoty(params: any, callBack: (data: any) => void) {
  let res = await request(`/admin/order/order/`, {
    method: 'GET',
    params,
  });
  if (res.code === 0) {
    callBack({
      tableData: res.data.list,
      total: res.data.total,
    });
  }
}
