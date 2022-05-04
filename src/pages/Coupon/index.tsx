/*
 * @Description: 优惠券管理
 * @Author: LaughingZhu
 * @Date: 2022-04-18 23:23:09
 * @LastEditros: 
 * @LastEditTime: 2022-04-18 23:36:07
 */
import { Button, Form, Icon, Modal, PageHeader, Input } from 'antd';
import React, { useState } from 'react'
import router from 'umi/router';
import styles from './style.module.less'

let id = 0;
interface EditTypes {
  id: string;
  name: string;
  coupon: {name: string}[] | null;
}
interface IProps {
  form: any;
}
function Coupon (props: IProps) {
  const { form } = props;
  const { getFieldDecorator, getFieldValue, resetFields } = form;
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
  getFieldDecorator('keys', { initialValue: [0] });
  const keys = getFieldValue('keys');

  const remove = (k: number) => {
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key: number) => key !== k),
    });
  };

  const add = () => {
    // can use data-binding to get
    id += 1;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  const formItems = keys.map((k: number, index: number) => (
    <Form.Item
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? '优惠内容' : ''}
      required={true}
      key={k}
    >
      {getFieldDecorator(`couponItem[${k}][name]`, {
        validateTrigger: ['onChange', 'onBlur'],
        initialValue: '',
        rules: [
          {
            required: true,
            whitespace: true,
            message: "优惠内容为必填项",
          },
        ],
      })(
        <Input placeholder="请输入优惠内容" style={{ width: '90%', marginRight: 8 }} />
      )}
      {index > 0 ? (
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => remove(k)}
        />
      ) : null}
    </Form.Item>
  ));

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
        const { couponItem, name } = values;
        const items = couponItem.filter((item: {name: string}) => item);
        const formData = {
          name,
          couponItem: items,
        }
        console.log(formData, 'formData------')
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
              label={'优惠名称'}
              required
            >
              {getFieldDecorator(`name`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "优惠名称为必填项",
                  },
                ],
              })(
                <Input placeholder="请输入优惠名称" style={{ width: '90%', marginRight: 8 }} />
              )}
              
            </Form.Item>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel} >
              <Button type="dashed" onClick={add} style={{ width: '90%' }}>
                <Icon type="plus" /> 添加优惠内容
              </Button>
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