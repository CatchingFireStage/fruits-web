/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-10-09 17:46:07
 * @LastEditros:
 * @LastEditTime: 2022-02-27 16:07:55
 */
import { Print } from '@/components/Print';
import { Button } from 'antd';
import React, { Component, createRef } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import { orderDelivery, orderFulfill } from './service';
import styles from './style.module.less';

const wsOrderServe = `ws:${
  process.env.NODE_ENV === 'development'
    ? '//106.12.76.73:8081' // //106.12.76.73:8081
    : '//api.catchingfire.top'
}/admin/order/orderWs`;
interface IProps {}
interface IState {
  socket: any;
  doingList: any; // 制作中
  doneList: any; // 制作完成
  makedList: any; // 制作中 -> 制作完成的列表，通过array.filter 实现 类似删除的功能，避免左右显示相同的订单
  finishList: any; // 制作完成 作用同上
}
class Order extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      socket: null,
      doingList: [],
      doneList: [],
      makedList: [],
      finishList: [],
    };
  }
  componentDidMount = () => {
    console.log('订单管理');
    // server-side

    this._initSocketConnection();
  };

  _initSocketConnection = () => {
    const socket = new WebSocket(wsOrderServe, [
      localStorage.getItem('fruit_token') || '',
    ]);

    socket.onerror = (err) => {
      console.log('错误', err);
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

        // 首次进来获取列表
        case 'PAY_ORDER_LIST':
          this.setState({
            doingList: JSON.parse(response.event),
          });
          break;

        // 已支付订单事件
        // 新的订单
        case 'PAY_ORDER':
          const resDoing = Object.assign([], this.state.doingList);
          resDoing.push(JSON.parse(response.event));
          this.setState({
            doingList: resDoing,
          });
          break;

        // 制作完成订单事件
        case 'FULFILL_ORDER_LIST':
          this.setState({
            doneList: JSON.parse(response.event),
          });
          break;

        // 制作完成订单列表事件
        case 'FULFILL_ORDER':
          const resDone = Object.assign([], this.state.doneList);
          resDone.push(JSON.parse(response.event));
          this.setState({
            doneList: resDone,
          });
          break;
        default:
          break;
      }
    };
    socket.onclose = () => {
      console.log('连接关闭');
    };
  };

  /**
   * @desc 订单-制作完成
   * @param id {number} 订单id
   */
  orderMaked = (id: number) => {
    orderFulfill(id, () => {
      this.setState({
        makedList: [...this.state.makedList, id],
      });
    });
  };

  /**
   * @desc 订单-已经送达
   * @param id {number} 订单id
   */
  orderFinished = (id: number) => {
    orderDelivery(id, () => {
      this.setState({
        finishList: [...this.state.finishList, id],
      });
    });
  };

  renderRefs = (el: any, id: number) => {
    if(!el) return;
    this[`print${id}ref`] = createRef();
    this[`print${id}ref`] = el;
    return () => this[`print${id}ref`]
  }

  render() {
    const { doingList, doneList, makedList, finishList } = this.state;
    const renderDodingList = doingList.filter((item: any) => {
      return !makedList.includes(item.id);
    });
    const renderDoneList = doneList.filter((item: any) => {
      return !finishList.includes(item.id);
    });

    console.log(renderDoneList)
    return (
      <div className={styles.container}>
        <div className={styles.doing}>
          <div className={styles.title}>制作中</div>
          <div className={styles.main}>
            {renderDodingList.map((item: any) => (
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
                <div className={styles.desk}>桌号:{item.description.desk}</div>
                <div className={styles.tools}>
                  <Button
                    size="small"
                    className={styles.button}
                    onClick={() => this.orderMaked(item.id)}
                  >
                    制作完成
                  </Button>
                </div>
                <div className={styles.tools}>
                  <ReactToPrint content={() => this[`print${item.id}ref`]}>
                    <PrintContextConsumer>
                      {({ handlePrint }) => (
                        <Button
                          size="small"
                          className={styles.button}
                          onClick={handlePrint}
                          type='primary'
                        >
                          打印小票
                        </Button>
                      )}
                    </PrintContextConsumer>
                  </ReactToPrint>
                  <div style={{ display: "none" }}><Print desc={item} ref={el => this.renderRefs(el, item.id)} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.done}>
          <div className={styles.title}>制作完成</div>
          <div className={styles.main}>
            {renderDoneList.map((item: any) => (
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
                <div className={styles.desk}>桌号:{item.description.desk}</div>
                <div className={styles.tools}>
                  <Button
                    size="small"
                    className={styles.button}
                    onClick={() => this.orderFinished(item.id)}
                  >
                    送达完成
                  </Button>
                </div>
                <div className={styles.tools}>
                  <ReactToPrint content={() => this[`print${item.id}ref`]}>
                    <PrintContextConsumer>
                      {({ handlePrint }) => (
                        <Button
                          size="small"
                          className={styles.button}
                          onClick={handlePrint}
                          type='primary'
                        >
                          打印小票
                        </Button>
                      )}
                    </PrintContextConsumer>
                  </ReactToPrint>
                  <div style={{ display: "none" }}><Print desc={item} ref={el => this.renderRefs(el, item.id)} /></div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Order;
