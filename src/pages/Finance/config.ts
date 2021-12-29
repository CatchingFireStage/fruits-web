/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-12-02 17:40:20
 * @LastEditros:
 * @LastEditTime: 2021-12-29 10:36:48
 */
export const stateArr = [
  // 支付状态,ORDER:下单，SUCCESS已支付,FAIL支付失败,REFUND退款
  {
    label: '下单',
    value: 'ORDER',
  },
  {
    label: '已支付',
    value: 'SUCCESS',
  },
  {
    label: '支付失败',
    value: 'FAIL',
  },
  {
    label: '退款',
    value: 'REFUND',
  },
];


// 退款的状态
export const refundState = [
  {
    label: '退款中',
    value: 'REFUND',
  },
  {
    label: '退款成功',
    value: 'SUCCESS',
  },
  {
    label: '退款异常',
    value: 'ABNORMAL',
  },
  {
    label: '退款关闭',
    value: 'CLOSE',
  }
]
