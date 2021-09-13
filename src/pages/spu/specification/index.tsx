/*
 * @Description: 规格管理
 * @Author: LaughingZhu
 * @Date: 2021-08-18 17:58:07
 * @LastEditros: 
 * @LastEditTime: 2021-09-14 00:08:51
 */
import { Button, Input, Modal, PageHeader, Popconfirm, Table } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination';
import Column from 'antd/lib/table/Column';
import React, { Component } from 'react'
import { addSpecification,  addSpecificationValue, delSpecificationValue, editSpecification, editSpecificationValue, specifications } from '../services';
import styles from '../category/style.less'
import { SpecificationTableData } from '../spu.dto';

interface IProps {}
interface IState {
  keyword: string;
  tableData: any;
  detail: any;
  modalStatus: boolean;
  pageInfo: {
    p: number;
    pageSize: number;
    total: number | undefined
  },
  type: boolean
}

export default class Specification extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      keyword: '',
      tableData: [],
      detail: {
        id: undefined,
        name: '',
        money: undefined,
        specificationId: undefined
      },
      modalStatus: false,
      pageInfo: {
        p: 1,
        pageSize: 10,
        total: undefined
      },
      type: false
    }
  }

  componentDidMount = () => {
    this._getTableData()
  }

  // 获取表格数据
  _getTableData = async (search?: string) => {
    const { keyword, pageInfo } = this.state
    const params = {
      keyword: search !== undefined ? search : keyword,
      ...pageInfo
    }

    specifications(params, (res: SpecificationTableData) => {
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
      this._getTableData()
    })
  }

  /**
   * 打开、关闭弹窗
   * @param status boolean  弹窗状态
   * @param isValue boolean 添加类型 false 是规格， true 是规格值
   * @param detail 内容详情，编辑用
   * @param specificationId 规格ID
   */
  modalHandle = (status: boolean, isValue: boolean, detail?: any) => {
    if(status) {
      // 打开弹窗
      this.setState({
        detail: {
          ...detail
        },
        modalStatus: true,
        type: isValue
      })

    } else {
      // 关闭->清空数据
      this.setState({
        modalStatus: false,
        type: isValue,
        detail: {
          id: undefined,
          name: '',
          money: undefined,
          specificationId: undefined
        },
      })
    }
  }

  // 编辑分类
  submit = async() => {
    const { detail, type } = this.state
    let reqData

    if(type) {
      // 规格值
      reqData = {
        id: detail.id,
        value: detail.name,
        specificationId: detail.specificationId,
        money: detail.money,
      }
    
      this.specificationValueHandle(reqData, detail.id === undefined ? false: true)
    } else {
      // 规格
      reqData = {
        id: detail.id,
        name: detail.name
      }
      this.specificationHandle(reqData, detail.id === undefined ? false: true)
    }
  }


  /**
   * @desc 规格值编辑、新增处理
   * @param requestData 
   * @param isEdit 是否是编辑
   */
  specificationValueHandle = (requestData: {
    id: number | undefined,
    specificationId: number,
    money: number,
    value: string,
  }, isEdit: boolean) => {
    if(isEdit) {
      // 编辑
      editSpecificationValue(requestData, () => {
        this._getTableData()
        this.resetFormValues()
      })

    } else {
      // 新增
      addSpecificationValue(requestData, () => {
        this._getTableData()
        this.resetFormValues()
      })

    }
  }

  /**
   * @desc 规格编辑、新增处理
   * @param requestData 
   * @param isEdit 是否是编辑
   */
  specificationHandle = (requestData: {
    id: number | undefined,
    name: string
  }, isEdit: boolean) => {
    if(isEdit) {
      // 编辑
      editSpecification(requestData, () => {
        this._getTableData()
        this.resetFormValues()
      })

    } else {
      // 新增
      addSpecification(requestData, () => {
        this._getTableData()
        this.resetFormValues()
      })

    }
  }


  // 删除数据处理
  popconfirmHandle = (type: boolean, id: number) => {
    if(!type) return false

    // 确认删除
    delSpecificationValue(id, () => {
      this._getTableData()
    })
    return true
  }


  // 重置搜索
  resetSearch = () => {
    this.setState({
      keyword: ''
    }, () => {
      this._getTableData()
    })
  }

  /**
   * @desc 规格值渲染
   * @param expandData [{ id: number, value: string, title: string }]
   * @returns 
   */
  expandedRowRender = (expandData: any) => {
    console.log(expandData, '额外行')

    return (
      <Table
        className={styles.main}
        rowKey={(record: any) => `sp_id_${record.id}`}
        pagination={false}
        bordered
        dataSource={expandData.values}>
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
              <Button onClick={() => this.modalHandle(true, true, {
                ...record,name: record.value,specificationId: expandData.id})}  type='primary' style={{marginLeft: 20}} >编辑</Button>
            </>
          )}
        />
      </Table>
    )
  }


  inputHandle = (type: 'name' | 'money', value: number | string) => {
    console.log(type, value, typeof(value))
    if(type === 'name') {
      this.setState({
        detail: {
          ...this.state.detail,
          name: value
        }
      })
    } else {
      this.setState({
        detail: {
          ...this.state.detail,
          money: Number(value)
        }
      })
    }
  }

  /**
   * @desc 重置表单值，关闭弹窗
   */
  resetFormValues = () => {
    this.setState({
      detail: {
        id: undefined,
        name: '',
        money: 0,
        specificationId: undefined
      },
      modalStatus: false,
    })
  }

  


  render () {
    const { keyword, pageInfo, tableData, modalStatus, detail, type } = this.state
    console.log(detail, 'console detail')
     // 搜索框内容
    const header = (
      <div className={styles.header}>
        <div className={styles.item}>
          <Input size='large' onChange={(e) => this.setState({keyword: e.target.value})} value={keyword} placeholder="请输入分类名称" />
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
          title="SPU规格管理"
          extra={[
            <Button onClick={() => this.resetSearch()} key="3" type='ghost'>重置</Button>,
            <Button onClick={() => this._getTableData()} key="2" type='ghost'>查询</Button>,
            <Button key="1" type="primary" onClick={() => this.modalHandle(true, false,{id: undefined, name: ''})}>添加规格</Button>,
          ]}
        >
          {header}
        </PageHeader>
        <Table
          className={styles.main}
          rowKey={(record: any) => record.id}
          pagination={paginationConfig}
          expandedRowRender={(record: any) => this.expandedRowRender(record)}
          dataSource={tableData}>
          
            
          <Column width={'30%'} align='center' title="序号" dataIndex="id" key="id" />
          <Column width={'30%'} align='center' title="规格名" dataIndex="name" key="name" />
  
          <Column
            title="操作"
            key="action"
            width={'40%'}
            
            align='center'
            render={(record: any) => (
              <>
                <Button onClick={() => this.modalHandle(true, false, record)}  type='default' style={{marginLeft: 20}} >编辑</Button>
                <Button onClick={() => this.modalHandle(true, true, {id: undefined, name: '', money: undefined, specificationId: record.id})}  type='primary' style={{marginLeft: 20}} >添加规格值</Button>
              </>
            )}
          />
        </Table>
  
        <Modal
          title={`${detail.id === undefined ? '新增': '编辑'}${type ? '规格值': '规格'}`}
          visible={modalStatus}
          onOk={this.submit}
          okText='确定'
          cancelText='取消'
          onCancel={() => this.modalHandle(false, false)}
        >
          <div className={styles.modal}>
            <Input size='large' onChange={(e) => this.inputHandle('name', e.target.value)} value={detail.name} placeholder={`请输入规格${type ? '值': ''}名称`} />
            {type && (
              <Input prefix="￥" suffix="RMB" style={{marginTop: '20px'}} size='large' type='number' onChange={(e) => this.inputHandle('money', e.target.value)} value={detail.money} placeholder="请输入价钱" />
            )}
          </div>
        </Modal>
      </div>
    )
  }
}