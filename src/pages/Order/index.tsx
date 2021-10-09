/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-10-09 17:46:07
 * @LastEditros:
 * @LastEditTime: 2021-10-09 19:48:25
 */
import React, { Component } from 'react';
interface IProps {}
interface IState {}
class Order extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    console.log('订单管理');
    // server-side
    const socket = new WebSocket('ws://106.12.76.73:8081/admin/order/orderWs', [
      localStorage.getItem('fruit_token'),
    ]);
    socket.onerror = (err) => {
      console.log(err, '错误');
      socket.send('这是token');
    };
    socket.onopen = (event) => {
      console.log(event, '打开');
    };
    socket.onmessage = (mess) => {
      console.log(mess, '消息');
      console.log(mess.data);
    };
    socket.onclose = () => {
      console.log('连接关闭');
    };
  };

  render() {
    return <div className="container">订单管理</div>;
  }
}

export default Order;
