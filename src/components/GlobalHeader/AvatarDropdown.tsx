/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2020-12-22 17:47:16
 * @LastEditros: 
 * @LastEditTime: 2021-09-14 10:15:28
 */
import { Avatar, Spin } from 'antd';
import React from 'react';

import { ConnectProps } from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {

  render(): React.ReactNode { 
    const currentUser = { avatar: require('../../assets/avatar.jpeg'), name: '管理员' }

    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={<></>}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
export default AvatarDropdown;
