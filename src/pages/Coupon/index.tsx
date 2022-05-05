/*
 * @Description: 优惠券管理
 * @Author: LaughingZhu
 * @Date: 2022-04-18 23:23:09
 * @LastEditros: 
 * @LastEditTime: 2022-04-18 23:36:07
 */
import { Button, Form, Icon, Modal, PageHeader, Input, Table, message, Popconfirm } from 'antd';
import React, { useCallback, useState } from 'react'
import styles from './style.module.less'
import { useEffect } from 'react';
import { addCoupon, getCouponList } from './services';
import Column from 'antd/lib/table/Column';
import { PaginationConfig } from 'antd/lib/pagination';
import { delCoupon } from './services';

interface IProps {
  form: any;
}
function Coupon (props: IProps) {
  const { form } = props;
  const { getFieldDecorator, resetFields } = form;
  const [editStatus, setEditStatus] = useState(false);
  const [editId, setEditId] = useState('')
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    p: 1,
    pageSize: 20,
    total: 0,
  })
  const [list, setList] = useState([])

  const getList = useCallback(async() => {
    try {
      const res = await getCouponList({...pageInfo})
      setList(res.data.list);
      setPageInfo({...pageInfo, total: res.data.total})
    } catch (err) {}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.p])
  useEffect(() => {
    getList()
  }, [getList])
  
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  const painationHandle = (page: number) => {
    setPageInfo({...pageInfo, p: page})
  }

  // 分页配置
  const paginationConfig: PaginationConfig = {
    total: pageInfo.total,
    current: pageInfo.p,
    pageSize: pageInfo.pageSize,
    showSizeChanger: false,
    showQuickJumper: false,
    onChange: (page: number) =>
      painationHandle(page),
    showTotal: (total: number) => `共 ${total} 条`,
  };

  const modalHandle = (type: boolean) => {
    setEditStatus(type)
    if(!type) {
      // 关闭modal时，清空表单数据
      resetFields();
      setEditId('')
    }
  }

  const handleSubmit = (e: any) => {
    e && e.preventDefault();
    props.form.validateFields(async(err: any, values: any) => {
      if (!err) {
        setLoading(true)
        const couponRequest = {...values}
        try {
          const res = await addCoupon(couponRequest);
          if(res.code === 0) {
            message.success(res.msg, 2, () => {
              setLoading(false)
              modalHandle(false);
              getList();
            })
          }
        } catch (error: any) {
          message.error(error.msg)
        }
      }
    });
  };

  const delHandle = async(id: number) => {
    try {
      const res = await delCoupon(id);
      if(res.code === 0) {
        message.success(res.msg, 2, () => {
          getList();
        });
      }
    } catch (err: any) {
      message.error(err.msg, 2);
    }
  }

  return (
    <div className={styles.root}>
      <PageHeader
        ghost={false}
        title="支付列表"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => modalHandle(true)}
          >
            新增
          </Button>,
        ]}
      />
      <Table
        className={styles.main}
        rowKey={(record: any) => record.id}
        pagination={paginationConfig}
        dataSource={list}>
        <Column align='center' title="优惠内容" dataIndex="payload" key="payload" render={(payload: any) => (
          <span>{`满${payload.discounts}元减${payload.waterLine}元`}</span>
        )} />

        <Column
          title="操作"
          key="action"
          align='center'
          render={(record: any) => (
            <>
              <Button type='primary' style={{marginLeft: 20}} >编辑</Button>
              <Popconfirm
                title="是否要删除该优惠内容?"
                onConfirm={() => delHandle(record.id)}
                okText="删除"
                cancelText="取消"
              >
                <Button type='danger' style={{marginLeft: 20}} >删除</Button>
              </Popconfirm>
              
            </>
          )}
        />
      </Table>

      {/* 编辑窗口 */}
      <Modal
        title={editId ? '优惠券编辑' : '新增优惠券'}
        visible={editStatus}
        onOk={(e: any) => handleSubmit(e)}
        onCancel={() => modalHandle(false)}
        centered
        maskClosable={false}
        footer={null}
      >
        <div className={styles.edit}>
          <Form onSubmit={handleSubmit}>
            <Form.Item
              {...formItemLayout}
              label={'满'}
              required
            >
              {getFieldDecorator(`discounts`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "满多少元",
                  },
                ],
              })(
                <Input type='number' placeholder="请输入满多少元" style={{ width: '90%', marginRight: 8 }} />
              )}
              
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={'减'}
              required
            >
              {getFieldDecorator(`waterLine`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "减多少元",
                  },
                ],
              })(
                <Input type='number' placeholder="请输入减多少元" style={{ width: '90%', marginRight: 8 }} />
              )}
              
            </Form.Item>
            <Form.Item {...formItemLayoutWithOutLabel} >
              <Button disabled={loading} type="primary" htmlType="submit" style={{ width: '90%' }}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>

    </div>
  )
}

export default Form.create({ name: 'coupon_edit' })(Coupon);;