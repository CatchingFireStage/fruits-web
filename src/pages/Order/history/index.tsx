/*
 * @Description: spu列表页
 * @Author: LaughingZhu
 * @Date: 2021-09-10 18:23:39
 * @LastEditros:
 * @LastEditTime: 2022-01-11 17:50:04
 */

import { Button, Divider, PageHeader, Select, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import { PaginationConfig } from 'antd/lib/pagination';

import React, { Component, Fragment } from 'react';
import styles from '../style.module.less';
import { orderHistoty } from '../service';

interface IProps {}
interface IState {
  status: number | undefined;
  tableData: any;
  pageInfo: {
    p: number;
    pageSize: number;
    total: number | undefined;
  };
}
const statusArr = [
  {
    value: 0,
    label: '下单',
  },
  {
    value: 1,
    label: '已支付',
  },
  {
    value: 2,
    label: '订单关闭',
  },
  {
    value: 3,
    label: '完成制作',
  },
  {
    value: 4,
    label: '已取餐',
  },
];

export default class OrderList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      status: undefined,
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

  searchHandle = (status: number) => {
    console.log(typeof status);
    this.setState({ status: Number(status) }, () => {
      this._getList(status);
    });
  };

  render() {
    const { pageInfo, tableData, status } = this.state;

    // 搜索框内容
    const header = (
      <div className={styles.header}>
        <div className={styles.item}>
          <p>状态： </p>
          <Select
            placeholder="请选择筛选类型"
            showArrow={true}
            style={{ width: '100%' }}
            value={status}
            onSelect={(e: number) => this.searchHandle(e)}
          >
            <Select.Option value={0} key={0}>
              下单
            </Select.Option>
            <Select.Option value={1} key={1}>
              已支付
            </Select.Option>
            <Select.Option value={2} key={2}>
              订单关闭
            </Select.Option>
            <Select.Option value={3} key={3}>
              完成制作
            </Select.Option>
            <Select.Option value={4} key={4}>
              已取餐
            </Select.Option>
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
          <Column align="center" title="桌号" render={(record: any) => record.description.desk} />

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
            render={(state: number) => {
              const result = statusArr.find((item) => item.value === state);
              return result?.label;
            }}
          />
        </Table>
      </div>
    );
  }
}
