/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2021-08-18 17:58:07
 * @LastEditros: 
 * @LastEditTime: 2021-08-28 09:20:06
 */
import { Button, Input, message, Modal, PageHeader, Popconfirm, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import React, { useState, useEffect } from 'react'
import { addCategroy, deleteCategoryById, editCategroy, getCategoryList } from '../services';
import styles from './style.less'


function Category () {
  const [keyword, setKeyword] = useState('')
  const [tableData, setTableData] = useState([])
  const [detail, setDetail] = useState({
    name: '',
    id: undefined
  })
  const [modalStatus, setModalStatus] = useState(false)
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  })

  useEffect(() => {
    getTableData()
  }, [pageInfo.page, pageInfo.pageSize])

  // 获取表格数据
  const getTableData = async (search?: string) => {
    const params = {
      keyword: search !== undefined ? search : keyword,
      ...pageInfo
    }
    const res = await getCategoryList(params)
    if (res.code === 0) {
      // 获取成功
      setTableData(res.data.list)
      setPageInfo({
        ...pageInfo,
        total: res.data.total
      })
    }
  }


  // 分页配置 处理函数
  const painationHandle = (current_page: number, pageSize: number) => {
    const config = Object.assign({}, pageInfo)
    
    setPageInfo({
      ...config,
      pageSize: pageSize,
      page: current_page
    })
  }

  // 根据id删除对应界面
  const delById = async(id: any) => {
    const res = await deleteCategoryById(id)
    if (res.code === 0) {
      message.success(res.message, 2, () => {
        getTableData()
      })
    } else {
      message.error(res.message, 2)
    }
  }
  // 删除数据处理
  const popconfirmHandle = (type: boolean, id: number) => {
    if(!type) return false

    // 确认删除
    delById(id)
    return true
  }

  // 打开、关闭弹窗
  const modalHandle = (type: boolean, detail?: any) => {
    if(type) {
      // 打开弹窗
      setDetail(detail)
      setModalStatus(true)

    } else {
      // 关闭->清空数据
      setModalStatus(false)
      setDetail({
        name: '',
        id: undefined
      })
    }
  }

  // 编辑分类
  const submit = async() => {
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
        modalHandle(false)
        getTableData()
      })
    }
  }

  const resetSearch = () => {
    setKeyword('')
    setTimeout(() => {
      getTableData('')
    }, 20);
  }

  // 搜索框内容
  const header = (
    <div className={styles.header}>
      <div className={styles.item}>
        <Input size='large' onChange={(e) => setKeyword(e.target.value)} value={keyword} placeholder="请输入分类名称" />,
      </div>
    </div>
  )

  // 分页配置
  const paginationConfig = {
    total: pageInfo.total,
    current: pageInfo.page,
    pageSize: pageInfo.pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    onChange: (page: number, pageSize: number) => painationHandle(page, pageSize),
    onShowSizeChange: (current: number, size: number) => painationHandle(current, size),
    showTotal: (total: number) => `共 ${total} 条`

  }
  console.log(detail)
  return (
    <div className={styles.container}>
      <PageHeader
        ghost={false}
        // className={styles.header}
        // onBack={() => window.history.back()}
        title="SPU分类管理"
        // subTitle="This is a subtitle"
        extra={[
          <Button onClick={() => resetSearch()} key="3" type='ghost'>重置</Button>,
          <Button onClick={getTableData} key="2" type='ghost'>查询</Button>,
          <Button key="1" type="primary" onClick={() => modalHandle(true, {id: undefined, name: ''})}>添加分类</Button>,
        ]}
      >
        {header}
      </PageHeader>
      <Table
        className={styles.main}
        rowKey={(record: any) => record.id}
        pagination={paginationConfig}
        dataSource={tableData}>
        <Column align='center' title="序号" dataIndex="id" key="id" />
        <Column align='center' title="姓名" dataIndex="name" key="name" />

        <Column
          title="操作"
          key="action"
          align='center'
          render={(record: any) => (
            <>
              <Popconfirm
                onConfirm={()=> popconfirmHandle(true, record.id)}
                onCancel={() => popconfirmHandle(false, record.id)}
                title="确认删除该条数据？"
                okText="确定"
                cancelText="取消">
                <Button type='danger' >删除</Button>
              </Popconfirm>
              <Button onClick={() => modalHandle(true, record)}  type='primary' style={{marginLeft: 20}} >编辑</Button>
            </>
          )}
        />
      </Table>

      <Modal
        title="编辑分类"
        visible={modalStatus}
        onOk={submit}
        okText='确定'
        cancelText='取消'
        onCancel={() => modalHandle(false)}
      >
        <div className={styles.modal}>
          <Input size='large' onChange={(e) => setDetail({...detail, name: e.target.value})} value={detail.name} placeholder="请输入分类名称" />,
        </div>
      </Modal>
    </div>
  )
}

export default Category;

