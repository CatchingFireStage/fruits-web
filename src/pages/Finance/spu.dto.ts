/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-09-13 10:15:23
 * @LastEditros:
 * @LastEditTime: 2021-09-23 11:39:39
 */
export interface SpecificationTableData {
  tableData:
    | [
        {
          id: number;
          value: string;
          required: boolean | null;
          values:
            | [
                {
                  id: number;
                  value: string;
                  money: string;
                },
              ]
            | null;
        },
      ]
    | []
    | null;
  total: number;
}

export interface SpuListTableData {
  tableData:
    | [
        {
          id: number;
          value: string;
          required: boolean | null;
          values:
            | [
                {
                  id: number;
                  value: string;
                  money: string;
                },
              ]
            | null;
        },
      ]
    | []
    | null;
  total: number;
}

/**
 * @desc 订单类型
 */
export interface DetailInfo {
  merchantTransactionObject:
    | {
        description: {
          couponInfo: string[];

          orderDescription: {
            spu: {
              money: string;
              name: string;
            };
            spuSpecificationValue: {
              money: string;
              name: string;
              value: string;
            }[];
          }[];

          payAmount: string;
        };
        id: number;
        state: string;
        user: {
          id: number;
          phone: string;
        };
      }
    | undefined;
  merchantTransactionType: string;
  merchantTransactionId: string;
  outTradeNo: string;
  transactionId: string;
  createTime: string;
  amount: string;
  refundAmount: string;
  state: string;
  refund: {
    amount: string;
    createTime: string;
    id: number;
    outRefundNo: string;
    reason: string;
    refundId: string;
    state: string;
  }[];
}
