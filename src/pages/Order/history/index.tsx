/*
 * @Description: spu列表页
 * @Author: LaughingZhu
 * @Date: 2021-09-10 18:23:39
 * @LastEditros:
 * @LastEditTime: 2021-10-19 09:19:55
 */

import { Button, Divider, PageHeader, Select, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import { PaginationConfig } from 'antd/lib/pagination';

import React, { Component, Fragment } from 'react';
import styles from '../style.module.less';
import { orderHistoty } from '../service';

interface IProps {}
interface IState {
  status: string;
  tableData: any;
  pageInfo: {
    p: number;
    pageSize: number;
    total: number | undefined;
  };
}

export default class OrderList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      status: '',
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

  _getList = (search?: string) => {
    const { status, pageInfo } = this.state;
    const params = {
      state: search !== undefined ? search : status,
      ...pageInfo,
    };

    orderHistoty(params, (res: any) => {
      this.setState({
        tableData: res.tableData,
        pageInfo: {
          ...pageInfo,
          total: res.total,
        },
      });
    });
  };

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

  searchHandle = (status: string) => {
    console.log(typeof status);
    this.setState({ status }, () => {
      this._getList(status);
    });
  };

  render() {
    const { pageInfo, tableData, status } = this.state;

    // 搜索框内容
    const header = (
      <div className={styles.header}>
        <div className={styles.item}>
          <Select
            placeholder="请选择筛选类型"
            showArrow={true}
            style={{ width: '100%' }}
            value={status}
            onSelect={(e: string) => this.searchHandle(e)}
          >
            <Select.Option key={0}>下单</Select.Option>
            <Select.Option key={1}>已支付</Select.Option>
            <Select.Option key={2}>订单关闭</Select.Option>
          </Select>
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
      <div className={styles.history}>
        <PageHeader ghost={false} title="历史订单">
          {header}
        </PageHeader>

        <Table
          className={styles.main}
          rowKey={(record: any) => record.id}
          pagination={paginationConfig}
          dataSource={tableData}
          bordered
        >
          <Column align="center" title="订单Id" dataIndex="id" key="id" />
          <Column
            align="center"
            title="商品名"
            dataIndex="description"
            key="name"
            render={(record: any) => {
              return record.orderDescription.map((item: any, index: number) => (
                <Fragment key={`name-${index}`}>
                  <p key={`name-${index}`}>{item.spu.name}</p>
                  {index !== record.orderDescription.length - 1 && <Divider />}
                </Fragment>
              ));
            }}
          />

          <Column
            align="center"
            title="规格值"
            dataIndex="description"
            key="spu"
            render={(record: any) => {
              return record.orderDescription.map((item: any, index: number) => (
                <Fragment key={`spu-${index}`}>
                  <p>
                    {item.spuSpecificationValue.map(
                      (child: any, childIndex: number) => (
                        <span key={`child-${childIndex}`}>
                          {child.name}
                          {childIndex === item.spuSpecificationValue.length - 1
                            ? ''
                            : '/'}
                        </span>
                      ),
                    )}
                  </p>
                  {index !== record.orderDescription.length - 1 && <Divider />}
                </Fragment>
              ));
            }}
          />
          <Column
            align="center"
            title="金额"
            dataIndex="payMoney"
            key="payMoney"
          />
          <Column
            align="center"
            title="状态"
            dataIndex="state"
            key="state"
            render={(state: number) =>
              state == 0 ? '下单' : state == 1 ? '已支付' : '订单关闭'
            }
          />
        </Table>
      </div>
    );
  }
}