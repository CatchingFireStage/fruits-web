/*
 * @Description: spu列表页
 * @Author: LaughingZhu
 * @Date: 2021-09-10 18:23:39
 * @LastEditros: 
 * @LastEditTime: 2021-10-02 20:15:39
 */

import { Button, Card, Form, Icon, Input, message, Modal, PageHeader, Switch, Upload } from 'antd';

import React, { Component } from 'react'
import styles from './style.module.less'
import { spuDetail } from '../services';

interface IProps {
  location: any;
  form: any
}
interface IState {
  detail: any;
  previewVisible: boolean;
  previewImage: string;
  fileList: any
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Detail extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      detail: {},
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-3',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-4',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-5',
          name: 'image.png',
          status: 'error',
        },
      ],
  
    }
  }

  componentDidMount = () => {
    this._initDetail()
  }

  /**
   * 初始化详情
   */
  _initDetail = async () => {
    const { id } = this.props.location.query

    spuDetail(id, (detail) => {
      this.setState({
        detail
      })
    })
  }

  /**
   * @desc 创建/保存
   */
  onSubmit = () => {
    this.props.form.validateFields((err: any) => {
      if (!err) {
        console.info('success');
      } else {
        console.log(err)
      }
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file: any) => {
    console.log('preview')
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  uploadFile = async(e: any) => {
    // setTimeout(async() => {
      const imageArr = this.props.form.getFieldValue('image')
      const { uid, name } = e.file
      const url = await getBase64(e.file)
      const picItem = {
        uid,
        name,
        status: 'done',
        file: e.file,
        url
      }
        
    
      this.props.form.setFieldsValue({
        image: [...imageArr, picItem]
      })
    // }, 20);
    
  }

  normFile = () => {
    console.log(this.props.form.getFieldValue('image'))
    return this.props.form.getFieldValue('image')
  };




  render () {
    const {detail, previewVisible, previewImage} = this.state
    const { getFieldDecorator } = this.props.form;
    console.log(this.props.form.getFieldsValue(), 'form')

    

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );


    return (
      <div className={styles.container}>
        <PageHeader
          ghost={false}
          title="商品详情"
          extra={[
            <Button key="1" type='ghost'>返回</Button>,
            <Button key="2" type="primary" >新增</Button>,
          ]}
        >
        </PageHeader>

        <div className={styles.main}>
          <Card title="商品内容" key='info' className={styles.card}>
            <div className={styles.info}>
              <Form.Item label="商品名称" className={styles.item}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入商品名称',
                    },
                  ],
                })(<Input placeholder="请输入商品名称" />)}
              </Form.Item>

              <Form.Item label="是否有货" className={styles.item}>
                {getFieldDecorator('inventory', {
                  valuePropName: 'checked',
                  initialValue: true,
                  rules: [
                    {
                      required: true,
                      message: '请选择是否有货',
                    },
                  ],
                })(<Switch
                  checkedChildren="有货"
                  unCheckedChildren="无货"
                  
                />)}
              </Form.Item>
            </div>
            <div className={styles.pics}>
              <Form.Item label="商品图片" className={styles.item}>
                {getFieldDecorator('image', {
                  validateTrigger: ['onChange, onBlur'],
                  valuePropName: 'fileList',
                  initialValue: [],
                  getValueFromEvent: (e: any) => this.normFile(),
                  rules: [
                    {
                      required: true,
                      message: '请输入商品名称',
                    },
                  ],
                })(
                  <Upload
                    accept="image/*"
                    // multiple
                    listType="picture-card"
                    onPreview={this.handlePreview}
                    customRequest={ (e: any) => this.uploadFile(e)}
                  >
                    {uploadButton}
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </Upload>
                    
                )}
              </Form.Item>
            </div>

          </Card>
          <Card title="商品分类" key='category' className={styles.card}>
          </Card>
          <Card title="关联信息" key='specification' className={styles.card}>
          </Card>

          <Button onClick={this.onSubmit} type='primary'>{detail ? '保存' : '创建'}</Button>
        </div>
      </div>
    )
  }
}

export default Form.create({ name: 'detail' })(Detail);;