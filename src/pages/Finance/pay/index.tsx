/*
 * @Description: 支付列表
 * @Author: LaughingZhu
 * @Date: 2021-09-10 18:23:39
 * @LastEditros:
 * @LastEditTime: 2021-12-29 15:27:15
 */

import { Button, Input, message, PageHeader, Table, Tooltip } from 'antd';
import Column from 'antd/lib/table/Column';
import { PaginationConfig } from 'antd/lib/pagination';
import React, { Component } from 'react';
import styles from '../../spu/category/style.less';
import { checkOrderResult, payList } from '../services';
import { stateArr } from '../config';
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

export default class Pay extends Component<IProps, IState> {
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
    this.initGetList();
  };

  initGetList = async () => {
    const { keyword, pageInfo } = this.state;
    const params = {
      keyword,
      ...pageInfo,
    };

    const res = await payList(params);
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
        this.initGetList();
      },
    );
  };

  // 查看详情
  onDetail = (id: number) => {
    if (!id) return false;

    router.push({
      pathname: '/finance/pay/detail',
      query: {
        id,
      },
    });
    return true;
  };

  onSearch = () => {
    this.setState(
      {
        pageInfo: {
          ...this.state.pageInfo,
          p: 1,
        },
      },
      () => {
        this.initGetList();
      },
    );
  };

  /**
   * @desc 手动检查是否支付成功
   * @param id {订单id}
   *
   */
  handleCheck = async (id: string) => {
    try {
      const res = await checkOrderResult(id);
      if (res.code === 0) {
        message.warning(res.data.tradeStateDesc);
      }
    } catch (error) {
      console.error(error);
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
            placeholder="商户系统订单号"
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
          title="支付列表"
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
          <Column
            align="center"
            title="微信支付单号"
            dataIndex="transactionId"
            key="transactionId"
          />
          <Column
            align="center"
            title="商户系统订单号"
            dataIndex="outTradeNo"
            key="outTradeNo"
          />
          <Column align="center" title="价格" dataIndex="amount" key="amount" />

          <Column
            align="center"
            title="状态"
            dataIndex="state"
            key="state"
            render={(text) =>
              stateArr.find((item) => item.value === text)?.label
            }
          />
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
            render={(record: any) => (
              <>
                <Button
                  onClick={() => this.onDetail(record.id)}
                  type="default"
                  style={{ marginLeft: 20 }}
                >
                  详情
                </Button>
                <Tooltip title="手动检查是否支付成功">
                  <Button
                    onClick={() => this.handleCheck(record.id)}
                    disabled={record.state !== stateArr[0].value}
                    type="primary"
                    style={{ marginLeft: 20 }}
                  >
                    查验
                  </Button>
                </Tooltip>
              </>
            )}
          />
        </Table>
      </div>
    );
  }
}
