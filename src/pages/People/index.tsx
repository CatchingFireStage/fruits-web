import React from "react";
import {Pagination, PageHeader, Table, Button, Descriptions} from 'antd';


interface State {
}

export default class People extends React.Component<{}, State> {


  state: State = {}


  render() {

    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ];

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
      },
    ];


    return (

      <React.Fragment>

          <Table dataSource={dataSource}
                 columns={columns}
                 bordered
                 title={()=>
                   <PageHeader
                     ghost={false}
                     onBack={() => window.history.back()}
                     title="过滤"
                     subTitle="选择过滤条件"
                     extra={[
                       <Button key="1" type="primary">
                         查询
                       </Button>,
                     ]}
                   >
                     <Descriptions size="small" column={3}>
                       <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
                       <Descriptions.Item label="Association">
                         <a>421421</a>
                       </Descriptions.Item>
                       <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
                       <Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
                       <Descriptions.Item label="Remarks">
                         Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
                       </Descriptions.Item>
                     </Descriptions>
                   </PageHeader>
                 }

                 footer={() => <Pagination defaultCurrent={1} total={50}/>   }
                 pagination={false}
          />





      </React.Fragment>

    );
  }
}
