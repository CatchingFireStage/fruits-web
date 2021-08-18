/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2021-08-06 15:54:56
 * @LastEditros: 
 * @LastEditTime: 2021-08-18 18:09:16
 */
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert } from 'antd';

import styles from './Welcome.less';

const CodePreview: React.FC<{}> = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card className='flex' style={{ height: '300px', fontSize: '30px'}}>
      欢迎来水果后台
    </Card>
  </PageHeaderWrapper>
);
