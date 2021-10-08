/*
 * @Description: spu列表页
 * @Author: LaughingZhu
 * @Date: 2021-09-10 18:23:39
 * @LastEditros: 
 * @LastEditTime: 2021-10-08 13:55:18
 */

import { Button, Card, Form, Icon, Input, message, Modal, PageHeader, Select, Switch, Table, Upload } from 'antd';

import React, { Component } from 'react'
import styles from './style.module.less'
import { addSpecificationSpu, addSpu, delSpecificationSpu, getCategoryList, specifications, spuDetail, updateSpecificationSpu } from '../services';
import { debounce } from 'lodash';
import Column from 'antd/lib/table/Column';
import { router } from 'umi';

interface picFile {
  uid: string,
  name: string,
  status: string,
  file: any,
  url: string | any
}
interface IProps {
  location: any;
  form: any
}
interface IState {
  detail: any;
  previewVisible: boolean;
  previewImage: string;
  categoryData: any;
  modalStatus: boolean;
  specificationData: any;
  modalForm: {
    required: number;
    specificationId: number | undefined,
  }
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
      categoryData: [],
      modalStatus: false,
      modalForm: {
        required: 1,
        specificationId: undefined,
      },
      specificationData: []
  
    }
    this._initCategory = debounce(this._initCategory, 800)
    this._initSpecification = debounce(this._initSpecification, 800)

  }

  componentDidMount = () => {
    const { id } = this.props.location.query
    id && this._initDetail();

    this._initCategory('')
    this._initSpecification('')
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
      this.props.form.setFieldsValue({
        file: [{
          uid: detail.image.fullUrl,
          name: detail.image.fullUrl,
          status: 'done',
          file: detail.image.fullUrl,
          url: detail.image.fullUrl
        }],
        name: detail.name,
        money: detail.money,
        categoryId: '' + detail.category.id,
        isisInventory: detail.isisInventory ? true: false
      })
    })
  }

  // 初始化分类数据
  _initCategory = async(keyword: string) => {
    const res = await getCategoryList({keyword})
    if (res.code === 0) {
      // 获取成功
      this.setState({categoryData: res.data.list})
    }
  }

  // 初始化规格数据
  _initSpecification = async(keyword: string) => {
    specifications({keyword}, (res: any) => {
      this.setState({
        specificationData: res.tableData
      })
    })
  }

  // 分类搜索
  handleSearch = (value: string) => {
    this._initCategory(value)
  };

  /**
   * @desc 创建/保存
   */
  onSubmit = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        const {file, name, money, categoryId, isInventory}  = values
        const reqData = new FormData()
        reqData.append('file', file[0].file)
        reqData.append('name', name)
        reqData.append('money', money)
        reqData.append('categoryId', categoryId)
        reqData.append('isInventory', isInventory ? '1': '0')

        addSpu(reqData)
      } else {
        console.log(err)
      }
    });
  }

  // 关闭图片预览
  handleCancel = () => this.setState({ previewVisible: false });

  // 图片预览
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

  // 上传图片
  uploadFile = async(e: any) => {
    // setTimeout(async() => {
      const { uid, name } = e.file
      const url = await getBase64(e.file)
      const picItem: picFile = {
        uid,
        name,
        status: 'done',
        file: e.file,
        url
      }
        
    
      this.props.form.setFieldsValue({
        file: [picItem]
      })
    // }, 20);
    
  }


  normFile = () => {
    return this.props.form.getFieldValue('file')
  };

  // 绑定关联关系
  specificationHanlde = () => {
    const { id } = this.props.location.query

    const modalForm= this.state.modalForm
    if(modalForm.specificationId === undefined) {
      message.error('请选择关联规格', 2)
      return false
    } else {
      addSpecificationSpu({
        ...modalForm,
        spuId: id
      }, () => {

        this._initDetail()
        this.modalStatusChange(false)

      })
      return;
    }
  }

  // 关联规格弹窗
  modalStatusChange = (modalStatus: boolean) => {
    if(!modalStatus) {
      this.setState({
        modalStatus,
        modalForm: {
          required: 1,
          specificationId: undefined
        }
      })
    } else {
      this.setState({
        modalStatus
      })
    }
  }

  // 修改规格状态
  tableStatusHandle = (info: {
    required: number,
    specificationSpuId: number
  }) => {
    const { required, specificationSpuId } = info
    Modal.confirm({
      content: `确定要将状态改为${required ? '非必选' : '必选'}嘛？`,
      onOk: () => {
        updateSpecificationSpu({id: specificationSpuId, required: required ? 0 : 1}, () => {
          this._initDetail();
        })
      },
      onCancel() {
        return false;
      },
    });
  }

  // 解除关联
  tableDelHandle = (id: number) => {
    Modal.confirm({
      content: `确定要解除该关联关系吗？`,
      onOk: () => {
        delSpecificationSpu(id, () => {
          this._initDetail()
        })
      },
      onCancel() {
        return false;
      },
    });
    
  }





  render () {
    const { detail, previewVisible, previewImage, categoryData, modalStatus, specificationData, modalForm } = this.state
    const { getFieldDecorator } = this.props.form;
    const { id } = this.props.location.query

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
          className={styles.header}
          extra={[
            <Button key="1" type='ghost' onClick={() => router.push('/spu/list')}>返回</Button>,
          ]}
        >
          <div className={styles.content}>
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
            <Form.Item label="商品价格" className={styles.item}>
              {getFieldDecorator('money', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品价格',
                  },
                ],
              })(<Input prefix="￥" type='number' placeholder="请输入商品价格" />)}
            </Form.Item>
            <Form.Item label="所属分类" className={styles.item}>
              {getFieldDecorator('categoryId', {
                rules: [
                  {
                    required: true,
                    message: '请选择所属分类',
                  },
                ],
              })(<Select
                showSearch
                allowClear
                placeholder='请选择所属分类'
                showArrow={false}
                style={{width: '100%'}}
                onSearch={(e:string) => this._initCategory(e)}
                notFoundContent={'没有匹配内容'}
              >
                {categoryData.map((item: any) => <Select.Option key={item.id}>{item.name}</Select.Option>)}
              </Select>)}
            </Form.Item>
            <Form.Item label="商品图片" className={styles.pics}>
              {getFieldDecorator('file', {
                validateTrigger: ['onChange, onBlur'],
                valuePropName: 'fileList',
                initialValue: [],
                getValueFromEvent: (e: any) => this.normFile(),
                rules: [
                  {
                    required: true,
                    message: '请上传商品图片',
                  },
                ],
              })(
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  showUploadList= {false}
                  onPreview={this.handlePreview}
                  customRequest={ (e: any) => this.uploadFile(e)}
                >
                  { this.props.form.getFieldValue('file').length === 1 ?<img src={this.props.form.getFieldValue('file')[0].url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Upload>
                  
              )}
            </Form.Item>
            <Form.Item label="是否有货" className={styles.item}>
              {getFieldDecorator('isInventory', {
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
          <Button onClick={this.onSubmit} type='primary'>{id ? '保存' : '创建'}</Button>
        </PageHeader>

          
        {id && 
        <Card title="关联信息" key='specification' className={styles.main} extra={<Button type='primary' onClick={() => this.setState({modalStatus: true})}>新增SPU关联</Button>}>
          <Table
            rowKey={(record: any) => record.id}
            pagination={false}
            dataSource={detail.specificationSPUs}>
            
              
            <Column width={'30%'} align='center' title="规格名" dataIndex="name" key="name" />
            <Column width={'30%'} align='center' title="是否必选" dataIndex="required" key="required" render={(value: boolean) => (
              <span style={{color: value ? '#2db7f5' : '#f50'}}>{value ? '必选' : '非必选'}</span>
            )} />
    
            <Column
              title="操作"
              key="action"
              width={'40%'}
              
              align='center'
              render={(record: any) => (
                <>
                  <Button size='default' onClick={() => this.tableStatusHandle(record)} type='primary'>修改状态</Button>
                  <Button size='default' onClick={() => this.tableDelHandle(record.specificationSpuId)} style={{ marginLeft: '10px'}} type='danger'>解除关联</Button>
                </>
              )}
            />
          </Table>
        </Card>}

        
        <Modal
          title="新增关联"
          visible={modalStatus}
          onOk={this.specificationHanlde}
          onCancel={() => this.modalStatusChange(false)}
        >
          <div className={styles.modal}>
            <div className={styles.item}>
              <div className={styles.label}>关联规格</div>
              <Select
                value={modalForm.specificationId}
                showSearch
                allowClear
                placeholder='请选择关联规格'
                showArrow={false}
                style={{width: '100%'}}
                onSearch={(e:string) => this._initSpecification(e)}
                notFoundContent={'没有匹配内容'}
                onChange={(specificationId: number) => this.setState({
                  modalForm: {
                    ...modalForm,
                    specificationId
                  }
                })}
              >
                {specificationData.map((item: any) => <Select.Option key={item.id}>{item.name}</Select.Option>)}
              </Select>
            </div>
            <div className={styles.item}>
              <div className={styles.label}>是否必选</div>
              <Switch
                checked={modalForm.required ? true : false}
                checkedChildren="必选"
                unCheckedChildren="非必选"
                onChange={(e: boolean) => this.setState({
                  modalForm: {
                    ...modalForm,
                    required: e ? 1 : 0
                  }
                })}
              />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Form.create({ name: 'detail' })(Detail);;