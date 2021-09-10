/*
 * @Description: 规格管理
 * @Author: LaughingZhu
 * @Date: 2021-08-18 17:58:07
 * @LastEditros: 
 * @LastEditTime: 2021-09-10 20:24:12
 */
import { Button, Input, message, Modal, PageHeader, Popconfirm, Table } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination';
import Column from 'antd/lib/table/Column';
import React, { Component } from 'react'
import { addCategroy, deleteCategoryById, editCategroy, getCategoryList } from '../services';
import styles from '../category/style.less'

interface IProps {}
interface IState {
  keyword: string;
  tableData: any;
  detail: any;
  modalStatus: boolean;
  pageInfo: {
    page: number;
    pageSize: number;
    total: number | undefined
  }
}
export default class Specification extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      keyword: '',
      tableData: [
        {
          id: 1,
          value: '温度',
          money: '10元',
          data: [
            {
              money: '1元',
              id: 1,
              value: '常温'
            },
            {
              money: '2元',
              id: 2,
              value: '加热'
            }
          ]
        },
        {
          id: 2,
          value: '糖',
          money: '0元',
          data: []
        }
      ],
      detail: {},
      modalStatus: false,
      pageInfo: {
        page: 1,
        pageSize: 10,
        total: undefined
      }
    }
  }

  componentDidMount = () => {
    // this.getTableData()
  }

  // 获取表格数据
  getTableData = async (search?: string) => {
    const { keyword, pageInfo } = this.state
    const params = {
      keyword: search !== undefined ? search : keyword,
      ...pageInfo
    }
    const res = await getCategoryList(params)
    if (res.code === 0) {
      // 获取成功
      this.setState({
        tableData: res.data.list,
        pageInfo: {
          ...pageInfo,
          total: res.data.total
        }
      })
    }
  }


  // 分页配置 处理函数
  painationHandle = (current_page: number, pageSize?: number) => {
    const config = Object.assign({}, this.state.pageInfo)
    
    this.setState({
      pageInfo: {
        ...config,
        pageSize: pageSize || 10,
        page: current_page
      }
    }, () => {
      this.getTableData()
    })
  }

  // 根据id删除对应界面
  delById = async(id: any) => {
    const res = await deleteCategoryById(id)
    if (res.code === 0) {
      message.success(res.message, 2, () => {
        this.getTableData()
      })
    } else {
      message.error(res.message, 2)
    }
  }
  // 删除数据处理
  popconfirmHandle = (type: boolean, id: number) => {
    if(!type) return false

    // 确认删除
    this.delById(id)
    return true
  }

  // 打开、关闭弹窗
  modalHandle = (type: boolean, detail?: any) => {
    if(type) {
      // 打开弹窗
      this.setState({
        detail,
        modalStatus: true
      })

    } else {
      // 关闭->清空数据
      this.setState({
        modalStatus: false,
        detail: {
          name: '',
          id: undefined
        }
      })
    }
  }

  // 编辑分类
  submit = async() => {
    const {detail} = this.state
    let res
    if(detail.id !== undefined) {
      // 编辑更新
      res = await editCategroy({name: detail.name}, detail.id)
    } else {
      // 新增
      res = await addCategroy({name: detail.name})
    }

    if (res.code === 0) {
      message.success(res.msg, 2, () => {
        this.setState({
          modalStatus: false,
        }, () => {
          this.getTableData()
        })
      })
    }
  }

  resetSearch = () => {
    setKeyword('')
    setTimeout(() => {
      getTableData('')
    }, 20);
  }


  expandedRowRender = (expandData: any) => {
    console.log(expandData, '额外行')

    return (
      <Table
        className={styles.main}
        rowKey={(record: any) => `sp_id_${record.id}`}
        pagination={false}
        bordered
        dataSource={expandData}>
        <Column align='center' title="规格值序号" dataIndex="id" key="id" />
        <Column align='center' title="规格值名" dataIndex="value" key="value" />
        <Column align='center' title="价钱" dataIndex="money" key="money" />

        <Column
          title="操作"
          key="action"
          align='center'
          render={(record: any) => (
            <>
              <Popconfirm
                onConfirm={()=> this.popconfirmHandle(true, record.id)}
                onCancel={() => this.popconfirmHandle(false, record.id)}
                title="确认删除该条数据？"
                okText="确定"
                cancelText="取消">
                <Button type='danger' >删除</Button>
              </Popconfirm>
              <Button onClick={() => this.modalHandle(true, record)}  type='primary' style={{marginLeft: 20}} >编辑</Button>
            </>
          )}
        />
      </Table>
    )
  }

  


  render () {
    const { keyword, pageInfo, tableData, modalStatus, detail } = this.state

     // 搜索框内容
    const header = (
      <div className={styles.header}>
        <div className={styles.item}>
          <Input size='large' onChange={(e) => this.setState({keyword: e.target.value})} value={keyword} placeholder="请输入分类名称" />,
        </div>
      </div>
    )

    // 分页配置
    const paginationConfig: PaginationConfig = {
      total: pageInfo.total,
      current: pageInfo.page,
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
          title="SPU规格管理"
          extra={[
            <Button onClick={() => this.resetSearch()} key="3" type='ghost'>重置</Button>,
            <Button onClick={() => this.getTableData()} key="2" type='ghost'>查询</Button>,
            <Button key="1" type="primary" onClick={() => this.modalHandle(true, {id: undefined, name: ''})}>添加分类</Button>,
          ]}
        >
          {header}
        </PageHeader>
        <Table
          className={styles.main}
          rowKey={(record: any) => record.id}
          pagination={paginationConfig}
          expandedRowRender={(record: any) => this.expandedRowRender(record.data)}
          dataSource={tableData}>
          
          <Column align='center' title="序号" dataIndex="id" key="id" />
          <Column align='center' title="规格名" dataIndex="value" key="value" />
  
          <Column
            title="操作"
            key="action"
            align='center'
            render={(record: any) => (
              <>
                <Popconfirm
                  onConfirm={()=> this.popconfirmHandle(true, record.id)}
                  onCancel={() => this.popconfirmHandle(false, record.id)}
                  title="确认删除该条数据？"
                  okText="确定"
                  cancelText="取消">
                  <Button type='danger' >删除</Button>
                </Popconfirm>
                <Button onClick={() => this.modalHandle(true, record)}  type='primary' style={{marginLeft: 20}} >编辑</Button>
              </>
            )}
          />
        </Table>
  
        <Modal
          title="编辑分类"
          visible={modalStatus}
          onOk={this.submit}
          okText='确定'
          cancelText='取消'
          onCancel={() => this.modalHandle(false)}
        >
          <div className={styles.modal}>
            <Input size='large' onChange={(e) => this.setState({
              ...detail, name: e.target.value
            })} value={detail.name} placeholder="请输入分类名称" />,
          </div>
        </Modal>
      </div>
    )
  }
}