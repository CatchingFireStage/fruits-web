/*
 * @Description: 退款列表
 * @Author: LaughingZhu
 * @Date: 2021-09-10 18:23:39
 * @LastEditros:
 * @LastEditTime: 2021-12-29 15:28:26
 */

import { Button, Input, message, Modal, PageHeader, Popconfirm, Table, Tag } from 'antd';
import Column from 'antd/lib/table/Column';
import { PaginationConfig } from 'antd/lib/pagination';

import React, { Component } from 'react';
import styles from '../../spu/category/style.less';
import { refundList, reiterateRefund } from '../services';
import { refundState } from '../config';
import router from 'umi/router';

interface IProps {}
interface IState {
  keyword: string;
  tableData: any;
  pageInfo: {
    p: number;
    pageSize: number;
    total: number | undefined;
  };
}

export default class Refund extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      keyword: '',
      tableData: [],
      pageInfo: {
        p: 1,
        pageSize: 10,
        total: undefined,
      },
    };
  }

  componentDidMount = () => {
    this._getList();
  };

  _getList = async () => {
    const { keyword, pageInfo } = this.state;
    const params = {
      keyword,
      ...pageInfo,
    };
    const res = await refundList(params);
    if (res.code === 0) {
      this.setState({
        tableData: res.data.list,
        pageInfo: {
          ...pageInfo,
          total: res.data.total,
        },
      });
    }
  };

  onSearch = () => {
    this.setState({
      pageInfo: {
        ...this.state.pageInfo,
        p: 1
      }
    }, () => {
      this._getList()
    })
  }

  // 分页配置 处理函数
  painationHandle = (current_page: number, pageSize?: number) => {
    const config = Object.assign({}, this.state.pageInfo);

    this.setState(
      {
        pageInfo: {
          ...config,
          pageSize: pageSize || 10,
          p: current_page,
        },
      },
      () => {
        this._getList();
      },
    );
  };

  // 重新退款
  onRefund = async(id: number) => {
    const res = await reiterateRefund​(id)
    if(res.code === 0) {
      message.success(res.msg, 2, () => this._getList())
    } else {
      message.error(res.msg, 2)
    }
  };

  render() {
    const { pageInfo, tableData } = this.state;

    // 搜索框内容
    const header = (
      <div className={styles.header}>
        <div className={styles.item}>
          <Input
            size="large"
            onChange={(e) => this.setState({ keyword: e.target.value })}
            placeholder="支付ID"
          />
        </div>
      </div>
    );

    // 分页配置
    const paginationConfig: PaginationConfig = {
      total: pageInfo.total,
      current: pageInfo.p,
      pageSize: pageInfo.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: (page: number, pageSize?: number) =>
        this.painationHandle(page, pageSize),
      onShowSizeChange: (current: number, size?: number) =>
        this.painationHandle(current, size),
      showTotal: (total: number) => `共 ${total} 条`,
    };

    return (
      <div className={styles.container}>
        <PageHeader
          ghost={false}
          title="退款列表"
          extra={[
            <Button key="2" type="ghost" onClick={() => this.onSearch()}>
              查询
            </Button>,
            <Button
              key="1"
              type="primary"
              onClick={() => router.push('/spu/list/detail')}
            >
              新增
            </Button>,
          ]}
        >
          {header}
        </PageHeader>

        <Table
          className={styles.main}
          rowKey={(record: any) => record.id}
          pagination={paginationConfig}
          dataSource={tableData}
        >
          {/* <Column align='center' title="序号" dataIndex="id" key="id" /> */}
          <Column align="center" title="ID" dataIndex="id" key="id" />
          <Column align="center" title="支付ID" dataIndex="payId" key="payId" />
          <Column align="center" title="微信支付退款单号" dataIndex="refundId" key="refundId" />
          <Column align="center" title="商户系统退款订单号" dataIndex="outRefundNo" key="outRefundNo" />

          <Column align="center" title="价格" dataIndex="amount" key="amount" />

          <Column
            align="center"
            title="状态"
            dataIndex="state"
            key="state"
            render={(text) =>
              refundState.find((item) => item.value === text)?.label
            }
          />
          <Column align="center" title="退款原因" dataIndex="reason" key="reason" />

          <Column
            align="center"
            title="时间"
            dataIndex="createTime"
            key="createTime"
          />

          <Column
            title="操作"
            key="action"
            align="center"
            fixed='right'
            render={(record: any) => (
              record.state === 'ABNORMAL' ?
                <Popconfirm
                  title="确定要对此订单退款吗？"
                  onConfirm={() => this.onRefund(record.id)}
                  okText="退款"
                  cancelText="取消"
                >
                  <Button
                    
                    type="primary"
                  >
                    重新退款
                  </Button>
                </Popconfirm>
                
                : '无'
            )}
          />
        </Table>
      </div>
    );
  }
}
