import { Button, Input, message, PageHeader } from 'antd';
import React, { useState } from 'react';
import { deskQrcode } from '../services';
import styles from './style.module.less';
/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-10-20 11:30:09
 * @LastEditros:
 * @LastEditTime: 2021-10-20 16:07:24
 */
interface IProps {}
export default function Qrcode(props: IProps) {
  const [desk, setDesk] = useState('');
  const [img, setImg] = useState('');

  const addQrcode = (value: any) => {
    console.log(value.target.value);
    setDesk(value.target.value);
  };

  const getDeskQrcode = () => {
    if (!desk) {
      return message.error('请先填入餐桌编号！', 2);
    }

    deskQrcode({ desk }, (res: any) => {
      setImg(res.data);
    });
    return;
  };

  const downLoad = () => {
    let parts = img.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;
    let uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    let blob = new Blob([uInt8Array], {
      type: contentType,
    });
    let aLink = document.createElement('a');
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = '二维码链接.png';
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
  };

  return (
    <div className={styles.container}>
      <PageHeader ghost={false} title="生成桌码" extra={[]}>
        <div className={styles.main}>
          <div className={styles.left}>
            <Input
              value={desk}
              onChange={(e) => addQrcode(e)}
              placeholder="请输入桌码"
              className={styles.input}
              type="text"
            />
            <Button onClick={getDeskQrcode}>生成小程序码</Button>
          </div>
          {img && (
            <div className={styles.right}>
              <img className={styles.qrcode} src={img} alt="" />
              <Button onClick={downLoad}>下载</Button>
            </div>
          )}
        </div>
      </PageHeader>
    </div>
  );
}
