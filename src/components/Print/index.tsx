/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2022-01-25 17:44:20
 * @LastEditros: 
 * @LastEditTime: 2022-01-26 12:14:10
 */

import React from "react";
import styles from './style.module.less'

export const PrintComponent = React.forwardRef((props: any, ref) => {
  const { desc } = props
  
  return (
    <div ref={ref} className={styles.box}>
      <div className={styles.title}>订单小票</div>
      <div className={styles.mark}>****************************************</div>
      <div className={styles.id}>订单号：{desc.id}</div>
      <div className={styles.desk}>桌号：{desc.description.desk}</div>
      <div className={styles.create_time}>下单时间：{desc.createTime}</div>
      <div className={styles.mark}>****************************************</div>
      <div className={styles.order}>
        {desc.description.orderDescription && desc.description.orderDescription.map((item: any, index: number) => (
          <div className={styles.item} key={index}>
            <div className={styles.name}>{item.spu.name}</div>
            <div className={styles.spu_box}>
              <div className={styles.spu}>{item.spuSpecificationValue.map((spu: any) => <span key={spu.name} className={styles.spu}>{spu.value}</span> )}</div>
              <div className={styles.count}>1份</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.mark}>****************************************</div>
      <div className={styles.total}>总计：{desc.payMoney}</div>

      <div className={styles.mark}>****************************************</div>
    </div>
  );
});

const compartor = (prevProps: any, nextProps: any) => {

  return prevProps.desc.id === nextProps.desc.id;
}
export const Print= React.memo(PrintComponent, compartor);