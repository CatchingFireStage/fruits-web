/*
 * @Description: spu列表页
 * @Author: LaughingZhu
 * @Date: 2021-09-10 18:23:39
 * @LastEditros: 
 * @LastEditTime: 2021-10-09 15:02:03
 */

import { Button, Input, Modal, PageHeader, Table, Tag } from 'antd';
import Column from 'antd/lib/table/Column';
import { PaginationConfig } from 'antd/lib/pagination';

import React, { Component } from 'react'
import styles from '../category/style.less'
import { delSpu, spuList } from '../services';
import { SpuListTableData } from '../spu.dto';
import router from 'umi/router';

interface IProps {}
interface IState {
  keyword: string;
  tableData: any;
  pageInfo: {
    p: number;
    pageSize: number;
    total: number | undefined
  },
}

export default class List extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      keyword: '',
      tableData: [],
      pageInfo: {
        p: 1,
        pageSize: 10,
        total: undefined
      },
    }
  }

  componentDidMount = () => {
    this._getList()
  }

  _getList = (search?: string) => {
    const { keyword, pageInfo } = this.state
    const params = {
      keyword: search !== undefined ? search : keyword,
      ...pageInfo
    }

    spuList(params, (res: SpuListTableData) => {
      this.setState({
        tableData: res.tableData,
        pageInfo: {
          ...pageInfo,
          total: res.total
        }
      })
    })
  }

  // 分页配置 处理函数
  painationHandle = (current_page: number, pageSize?: number) => {
    const config = Object.assign({}, this.state.pageInfo)
    
    this.setState({
      pageInfo: {
        ...config,
        pageSize: pageSize || 10,
        p: current_page
      }
    }, () => {
      this._getList()
    })
  }

  // 查看详情
  onDetail = (id: number) => {
    if(!id) return false;

    router.push({
      pathname: '/spu/list/detail',
      query: {
        id
      }
    })
    return true
  }

  delSpu = (id: number) => {
    Modal.confirm({
      content: `确定要删除该spu记录吗？`,
      onOk: () => {
        delSpu(id, () => {
          this._getList()
        })
      },
      onCancel() {
        return false;
      },
    });
  }



  render () {
    const { pageInfo, tableData } = this.state

     // 搜索框内容
    const header = (
      <div className={styles.header}>
        <div className={styles.item}>
          <Input size='large' onChange={(e) => this.setState({keyword: e.target.value})} placeholder="请输入分类名称" />
        </div>
      </div>
    )

    // 分页配置
    const paginationConfig: PaginationConfig = {
      total: pageInfo.total,
      current: pageInfo.p,
      pageSize: pageInfo.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: (page: number, pageSize?: number) => this.painationHandle(page, pageSize),
      onShowSizeChange: (current: number, size?: number) => this.painationHandle(current, size),
      showTotal: (total: number) => `共 ${total} 条`

    }

    return (
      <div className={styles.container}>
        <PageHeader
          ghost={false}
          title="SPU列表页"
          extra={[
            <Button key="3" type='ghost'>重置</Button>,
            <Button key="2" type='ghost' >查询</Button>,
            <Button key="1" type="primary" onClick={() => router.push('/spu/list/detail')} >新增</Button>,
          ]}
        >
          {header}
        </PageHeader>

        <Table
          className={styles.main}
          rowKey={(record: any) => record.id}
          pagination={paginationConfig}
          dataSource={tableData}>
          
            
          {/* <Column align='center' title="序号" dataIndex="id" key="id" /> */}
          <Column align='center' title="图片" dataIndex="image" key="image" render={(images: any) => (
            <img style={{width: '50px', height: '50px'}} src={images.fullUrl} />
          )} />
          <Column align='center' title="规格名" dataIndex="name" key="name" />

          <Column align='center' title="所属分类" dataIndex="category" key="category" render={(category: any) => <span>{category.
          name}</span> } />
          <Column align='center' title="价格" dataIndex="money" key="money" render={(money: string) => <>{money}元</>} />

          <Column align='center' title="是否有货" dataIndex='isInventory'  key="isInventory" render={(isInventory: number) => <Tag color={isInventory ? '#2db7f5' : '#f50'}>{isInventory ? '有货' :'无货'}</Tag>} />

  
          <Column
            title="操作"
            key="action"
            
            align='center'
            render={(record: any) => (
              <>
                <Button onClick={() => this.onDetail(record.id)} type='default' style={{marginLeft: 20}} >详情</Button>
                <Button onClick={() => this.delSpu(record.id)} type='danger' style={{marginLeft: 20}} >删除</Button>

              </>
            )}
          />
        </Table>
      </div>
    )
  }
}