import React from "react";
import {Descriptions,Switch,Spin,TimePicker} from 'antd';
import {getMerchant, updateMerchant} from "./services"
import moment from 'moment';
import MerchantDetailResponse from './response/merchantDetailResponse';




interface State {
  //服务端的接口返回数据
  merchantDetailResponse?:MerchantDetailResponse
  //是否第一次加载过
  isInit:boolean
}

export default class Merchant extends React.Component<{}, State> {


  state: State = {isInit:false}



  //组件挂在的时候会调用
  componentDidMount() {

    //获取商家信息
    let api = getMerchant();
    api.then(response =>{
      if (response.code == 0) {
        return response.data;
      }
    }).then((responseJson) => {

      let merchantDetailResponse = new MerchantDetailResponse();
      merchantDetailResponse.startTime = new Date(responseJson.startTime)
      merchantDetailResponse.endTime = new Date(responseJson.endTime)
      merchantDetailResponse.is24Hours = responseJson.is24Hours
      merchantDetailResponse.isClose = responseJson.isClose
      //状态变成
      this.setState({
        merchantDetailResponse: merchantDetailResponse,
        isInit: true
      });
    }, (error) =>{
      console.log("有错误",error)
    })

  }


  //是否休息切换
  isCloseOnChange(checked: boolean, event: Event){

    //需要更新的值
    let merchantDetailResponse = new MerchantDetailResponse();
    merchantDetailResponse.startTime = this.state.merchantDetailResponse?.startTime as Date
    merchantDetailResponse.endTime = this.state.merchantDetailResponse?.endTime as Date
    merchantDetailResponse.isClose = checked
    merchantDetailResponse.is24Hours = this.state.merchantDetailResponse?.is24Hours as boolean

    let api = updateMerchant(merchantDetailResponse);
    api.then(response => {
      if(response.code == 0){
        return response.data;
      }
    }).then(responseJson => {
      //更新成功
      this.setState({merchantDetailResponse:merchantDetailResponse})
    })

  }


  render() {

    if(!this.state.isInit){
      //没有初始化的是时候
      return (
        <Spin tip={"网络慢耐心等待"}>
        </Spin>
      );
    }

    return (
      <Descriptions title="商家信息" layout="vertical" bordered={true}>
        <Descriptions.Item label="开始营业时间">
          <TimePicker
            defaultValue={moment(this.state.merchantDetailResponse?.getStartTimeMomentFormat(), MerchantDetailResponse.format)}
            format={MerchantDetailResponse.format}/>
        </Descriptions.Item>
        <Descriptions.Item label="结束营业时间">
          <TimePicker
            defaultValue={moment(this.state.merchantDetailResponse?.getEndTimeMomentFormat(), MerchantDetailResponse.format)}
            format={MerchantDetailResponse.format}/>
        </Descriptions.Item>
        <Descriptions.Item label="是否二十四小时营业">
          <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.merchantDetailResponse?.is24Hours}/>
        </Descriptions.Item>
        <Descriptions.Item label="是否休息">
          <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.merchantDetailResponse?.isClose} onChange={this.isCloseOnChange.bind(this)} />
        </Descriptions.Item>
      </Descriptions>
    );
  }
}
