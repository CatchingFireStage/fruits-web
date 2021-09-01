import React from "react";
import {Descriptions, Switch, Spin, TimePicker, Button, message} from 'antd';
import {getMerchant, updateMerchant} from "./services"
import moment, {Moment} from 'moment';
import {MerchantDetailDTO} from "./dto/MerchantDetailDTO"


interface State {
  //服务端的接口返回数据
  merchantDetailDTO: MerchantDetailDTO
  //是否第一次加载过
  isInit: boolean
}

export default class Merchant extends React.Component<{}, State> {


  state: State = {
    isInit: false,
    merchantDetailDTO: {
      startTime: new Date(),
      endTime: new Date(),
      is24Hours: false,
      isClose: false
    }
  }


  //组件挂在的时候会调用
  componentDidMount() {
    //获取商家信息
    getMerchant((merchantDetailDTO) => {
      //状态变成
      this.setState({
        merchantDetailDTO: merchantDetailDTO,
        isInit: true
      });

    });

  }


  //是否休息切换
  isCloseOnChange(checked: boolean, event: Event) {
    this.setState({merchantDetailDTO: {...this.state.merchantDetailDTO, isClose: checked}})
  }

  //是否24小时
  is24HoursOnChange(checked: boolean, event: Event) {
    this.setState({merchantDetailDTO: {...this.state.merchantDetailDTO, is24Hours: checked}})
  }

  //开始营业时间
  startTimeOnChange(time: Moment, timeString: string) {
    this.setState({merchantDetailDTO: {...this.state.merchantDetailDTO, startTime: time.toDate()}})
  }

  //结束营业时间
  endTimeOnChange(time: Moment, timeString: string) {
    this.setState({merchantDetailDTO: {...this.state.merchantDetailDTO, endTime: time.toDate()}})
  }

  //更新商家数据
  updateMerchant() {

    console.log(this.state.merchantDetailDTO.startTime)
    //数据验证
    let startTime = this.state.merchantDetailDTO.startTime.toISOString();
    let endTime = this.state.merchantDetailDTO.endTime.toISOString();
    console.log(Date.parse(endTime) - Date.parse(startTime) >= 1000 * 60 * 60 * 3)
    if (Date.parse(endTime) - Date.parse(startTime) <= 1000 * 60 * 60 * 3) {
      message.error("营业时间只要3小时")
      return
    }

    //更新商家数据
    updateMerchant(this.state.merchantDetailDTO);
  }


  render() {


    if (!this.state.isInit) {
      //没有初始化的是时候
      return (
        <Spin tip={"网络慢耐心等待"}>
        </Spin>
      );
    }

    return (
      <React.Fragment>

        {/*详情页*/}
        <Descriptions title="商家信息" layout="vertical" bordered={true}>
          <Descriptions.Item label="开始营业时间">
            <TimePicker
              defaultValue={moment(this.state.merchantDetailDTO.startTime, "HH:mm")}
              format={"HH:mm"} onChange={this.startTimeOnChange.bind(this)}/>
          </Descriptions.Item>
          <Descriptions.Item label="结束营业时间">
            <TimePicker
              defaultValue={moment(this.state.merchantDetailDTO.endTime, "HH:mm")}
              format={"HH:mm"} onChange={this.endTimeOnChange.bind(this)}/>
          </Descriptions.Item>
          <Descriptions.Item label="是否二十四小时营业">
            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.merchantDetailDTO.is24Hours}
                    onChange={this.is24HoursOnChange.bind(this)}/>
          </Descriptions.Item>
          <Descriptions.Item label="是否休息">
            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.merchantDetailDTO.isClose}
                    onChange={this.isCloseOnChange.bind(this)}/>
          </Descriptions.Item>
        </Descriptions>

        {/*提交按钮*/}
        <Button type="primary" block onClick={this.updateMerchant.bind(this)}>保存</Button>

      </React.Fragment>
    );
  }
}
