/*
 * @Description: 优惠券管理
 * @Author: LaughingZhu
 * @Date: 2022-04-18 23:23:09
 * @LastEditros: 
 * @LastEditTime: 2022-04-18 23:36:07
 */
import { Button, Form, Icon, Modal, PageHeader, Input } from 'antd';
import React, { useState } from 'react'
import styles from './style.module.less'

interface IProps {
  form: any;
}
function Coupon (props: IProps) {
  const { form } = props;
  const { getFieldDecorator, resetFields } = form;
  const [editStatus, setEditStatus] = useState(false);
  const [editId, setEditId] = useState('')
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

  // 分页配置
  // const paginationConfig: PaginationConfig = {
  //   total: pageInfo.total,
  //   current: pageInfo.p,
  //   pageSize: pageInfo.pageSize,
  //   showSizeChanger: true,
  //   showQuickJumper: true,
  //   onChange: (page: number, pageSize?: number) =>
  //     this.painationHandle(page, pageSize),
  //   onShowSizeChange: (current: number, size?: number) =>
  //     this.painationHandle(current, size),
  //   showTotal: (total: number) => `共 ${total} 条`,
  // };
  const handleSubmit = (e: any) => {
    e && e.preventDefault();
    props.form.validateFields((err: any, values: any) => {
      if (!err) {

        console.log(values, 'formData------')
      }
    });
  };

  const modalHandle = (type: boolean) => {
    setEditStatus(type)
    if(!type) {
      // 关闭modal时，清空表单数据
      resetFields();
      setEditId('')
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
              <Button type="primary" htmlType="submit" style={{ width: '90%' }}>
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