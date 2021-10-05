/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2021-08-06 15:54:56
 * @LastEditros: 
 * @LastEditTime: 2021-09-10 15:46:05
 */
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card className='flex' style={{ height: '300px', fontSize: '30px'}}>
      欢迎来水果后台
    </Card>
  </PageHeaderWrapper>
);
