/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-10-09 17:46:07
 * @LastEditros:
 * @LastEditTime: 2021-10-12 10:19:05
 */
import { Button } from 'antd';
import React, { Component } from 'react';
import styles from './style.module.less';
interface IProps {}
interface IState {
  socket: any;
  doingList: any; // 制作中
  doneList: any; // 制作完成
}
class Order extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      socket: null,
      doingList: [],
      doneList: [],
    };
  }
  componentDidMount = () => {
    console.log('订单管理');
    // server-side

    this._initSocketConnection();
  };

  _initSocketConnection = () => {
    const socket = new WebSocket('ws://106.12.76.73:8081/admin/order/orderWs', [
      localStorage.getItem('fruit_token') || '',
    ]);

    socket.onerror = (err) => {
      console.log('错误');
    };
    socket.onopen = (event) => {
      console.log('链接成功');
    };
    socket.onmessage = (res) => {
      // console.log(mess, '消息');
      // eventType 返回消息对应的类型

      const response = JSON.parse(res.data);
      // eventType 返回消息对应的类型
      // let data = null
      switch (response.eventType) {
        // 已支付订单列表事件

        case 'PAY_ORDER_LIST':
          this.setState({
            doingList: [...this.state.doingList, ...JSON.parse(response.event)],
          });
          break;

        // 已支付订单事件
        case 'PAY_ORDER':
          break;

        // 制作完成订单事件
        case 'FULFILL_ORDER_LIST':
          break;

        // 制作完成订单列表事件
        case 'FULFILL_ORDER':
          break;
        default:
          break;
      }
    };
    socket.onclose = () => {
      console.log('连接关闭');
    };

    this.setState({
      socket,
    });
  };

  socketSend = (message: any) => {
    this.state.socket.send(message);
  };

  render() {
    console.log(this.state.doingList, this.state.doneList);
    const { doingList, doneList } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.doing}>
          <div className={styles.title}>制作中</div>
          <div className={styles.label}>
            <span style={{ flexBasis: '20%' }}>订单号</span>
            <span style={{ flexBasis: '30%' }}>商品</span>
            <span style={{ flexBasis: '30%' }}>规格值</span>
            <span style={{ flexBasis: '20%' }}>操作</span>
          </div>
          <div className={styles.main}>
            {doingList.map((item: any) => (
              <div key={`doing-${item.id}`} className={styles.item}>
                <span className={styles.sort}>{item.id}</span>
                <div className={styles.box}>
                  {item.description.orderDescription.map(
                    (child: any, index: number) => (
                      <div key={`spu-${index}`} className={styles.spu}>
                        <div className={styles.name}>{child.spu.name}</div>
                        <div className={styles.specifition}>
                          {child.spuSpecificationValue.map(
                            (spe: any, spe_Index: number) => (
                              <div
                                key={`spe-${spe_Index}`}
                                className={styles.spe_name}
                              >
                                {spe.value}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
                <div className={styles.tools}>
                  <Button size="small" className={styles.button}>
                    制作完成
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.done}>
          <div className={styles.title}>完成制作</div>
          <div className={styles.main}></div>
        </div>
      </div>
    );
  }
}

export default Order;
