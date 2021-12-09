/*
 * @Description: 订单详情
 * @Author: LaughingZhu
 * @Date: 2021-12-08 10:43:12
 * @LastEditros:
 * @LastEditTime: 2021-12-09 16:16:01
 */
import React from 'react';
import styles from './detail.less';
import { useEffect, useState } from 'react';
import { detail } from '../services';
import { Button, PageHeader, Table } from 'antd';
import { stateArr } from '../config';
import Column from 'antd/lib/table/Column';

interface IProps {
  location: any;
}
function Detail(props: IProps) {
  const { id } = props.location.query;
  const [info, setInfo] = useState({});

  useEffect(() => {
    if (id) {
      _getDetail();
    }
  }, [id]);

  const _getDetail = async () => {
    const res = await detail(id);
    if (res.code === 0) {
      setInfo(res.data);
    }
  };

  console.log(info);
  return (
    <div className={styles.detail}>
      <PageHeader
        ghost={false}
        title="支付详情"
        extra={[
          <Button key="1" type="ghost">
            返回
          </Button>,
          <Button key="2" type="primary">
            手动退款
          </Button>,
        ]}
      >
        <div className={styles.top}>
          <div className={styles.top_item}>
            <div className={styles.top_label}>退款人Id：</div>
            <div className={styles.top_value}>
              {info.merchantTransactionObject &&
                info.merchantTransactionObject.user.id}
            </div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_label}>退款人手机号：</div>
            <div className={styles.top_value}>
              {info.merchantTransactionObject &&
                info.merchantTransactionObject.user.phone}
            </div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_label}>支付对象：</div>
            <div className={styles.top_value}>
              {info.merchantTransactionType}
            </div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_label}>支付对象Id：</div>
            <div className={styles.top_value}>{info.merchantTransactionId}</div>
          </div>

          <div className={styles.top_item}>
            <div className={styles.top_label}>商户系统支付订单号：</div>
            <div className={styles.top_value}>{info.outTradeNo}</div>
          </div>

          <div className={styles.top_item}>
            <div className={styles.top_label}>微信系统支付订单号：</div>
            <div className={styles.top_value}>{info.transactionId}</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_label}>支付时间：</div>
            <div className={styles.top_value}>{info.createTime}</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_label}>支付状态：</div>
            <div className={styles.top_value}>{info.state}</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_label}>支付金额：</div>
            <div className={styles.top_value}>{info.amount}元</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_label}>已退款金额：</div>
            <div className={styles.top_value}>{info.refundAmount}元</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_label}>商品详情：</div>
            <div className={styles.top_value}>
              {info.merchantTransactionObject &&
                info.merchantTransactionObject.description.orderDescription.map(
                  (item: any, index: number) => (
                    <div className={styles.list} key={index}>
                      <div className={styles.list_item} key={'header'}>
                        <div className={styles.list_name}>商品/规格</div>
                        <div className={styles.list_money}>金额</div>
                      </div>
                      <div className={styles.list_item} key={'name'}>
                        <div className={styles.list_name}>{item.spu.name}</div>
                        <div className={styles.list_money}>
                          {item.spu.money}
                        </div>
                      </div>
                      {item.spuSpecificationValue.map((child) => (
                        <div
                          className={styles.list_item}
                          key={'child-' + child.name}
                        >
                          <div className={styles.list_name}>{child.name}</div>
                          <div className={styles.list_money}>{child.money}</div>
                        </div>
                      ))}
                    </div>
                  ),
                )}
            </div>
          </div>
        </div>
      </PageHeader>

      <Table
        className={styles.main}
        rowKey={(record: any) => record.id}
        pagination={false}
        dataSource={info.refund || []}
      >
        {/* <Column align='center' title="序号" dataIndex="id" key="id" /> */}
        <Column
          align="center"
          title="退款微信系统订单号"
          dataIndex="refundId"
          key="refundId"
        />
        <Column
          align="center"
          title="退款原因"
          dataIndex="reason"
          key="reason"
        />
        <Column
          align="center"
          title="申请时间"
          dataIndex="createTime"
          key="createTime"
        />
        <Column
          fixed="right"
          align="center"
          title="退款金额"
          dataIndex="amount"
          key="amount"
        />
        <Column
          fixed="right"
          align="center"
          title="状态"
          dataIndex="state"
          key="state"
          render={(text) => stateArr.find((item) => item.value === text)?.label}
        />
      </Table>
    </div>
  );
}

export default Detail;
