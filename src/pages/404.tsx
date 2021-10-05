/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2020-12-22 17:47:17
 * @LastEditros: 
 * @LastEditTime: 2021-08-18 18:09:47
 */
import { Button, Result } from 'antd';
import React from 'react';
import { router } from 'umi';

// 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="404"
    title="404"
    subTitle="您暂无对应功能的使用权限，"
    // extra={
    //   <Button type="primary" onClick={() => router.push('/')}>
    //     Back Home
    //   </Button>
    // }
  ></Result>
);

export default NoFoundPage;
