import React from "react";
import {Pagination, PageHeader, Table, Button, Descriptions, Input, Spin} from 'antd';
import {UserListDTO} from "@/pages/People/dto/UserListDTO";
import {getUserList} from "@/pages/People/services";
import Column from "antd/lib/table/Column";


interface State {
  userListDTO?: UserListDTO,
  //是否第一次加载完毕
  isInit: boolean,
  query: {
    keyword: string
    //当前是第几页
    p: number
  }
}


export default class People extends React.Component<any, State> {

  state: State = {
    isInit: false,
    query: {
      keyword: "",
      p: 1
    }
  }


  //组件挂在的时候会调用
  componentDidMount() {
    // 获取商家信息
    getUserList(this.state.query.p, this.state.query.keyword, (userListDTO) => {
      //状态变成
      this.setState({
        userListDTO: userListDTO,
        isInit: true
      });
    });

  }


  //翻页数据
  pageData(page: number, pageSize?: number) {

    getUserList(page, this.state.query.keyword, (userListDTO) => {
      this.setState({
        userListDTO: userListDTO
      })
    })
  }

  //查询
  query() {
    getUserList(1, this.state.query.keyword, userListDTO => {
      this.setState({
        userListDTO: userListDTO,
        query: {...this.state.query, p: 1}
      })
    })
  }


  render() {

    if (!this.state.isInit) {
      //没有初始化的是时候
      return (
        <Spin tip={"网络慢耐心等待"}>
        </Spin>
      );
    }


    return (

      <React.Fragment>

        <Table dataSource={this.state.userListDTO?.userDTOList}
               bordered
               title={() =>
                 <PageHeader
                   ghost={false}
                   onBack={() => window.history.back()}
                   title="过滤"
                   subTitle="选择过滤条件"
                   extra={[
                     <Button key="1" type="primary" onClick={this.query.bind(this)}>
                       查询
                     </Button>,
                   ]}
                 >
                   <Descriptions size="small" column={3}>
                     <Descriptions.Item label="搜索手机号">
                       <Input placeholder="手机号" onChange={(e) => {
                         this.setState({query: {...this.state.query, keyword: e.target.value}})
                       }}/>
                     </Descriptions.Item>
                   </Descriptions>
                 </PageHeader>
               }

               footer={
                 () =>
                   <Pagination defaultCurrent={this.state.query.p} total={this.state.userListDTO?.total}
                               defaultPageSize={1} onChange={this.pageData.bind(this)}/>
               }
               pagination={false}
        >


          <Column align='center' title="id" dataIndex="id" key="id"/>
          <Column align='center' title="手机号" dataIndex="phone" key="phone"/>

        </Table>


      </React.Fragment>

    );
  }
}
