import { Alert } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { message } from 'antd'

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { router } from 'umi'
import LoginComponents from './components/Login';
import { login } from './service'
import styles from './style.less';

const { Tab, UserName, Password,  Submit } = LoginComponents;

interface UserLoginProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}
interface UserLoginState {
  type: string;
  autoLogin: boolean;
}
export interface FormDataType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
}

class UserLogin extends Component<
  UserLoginProps,
  UserLoginState
> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: UserLoginState = {
    type: 'account',
    autoLogin: true,
  };


  handleSubmit = async(err: any, values: FormDataType) => {
    // const { type } = this.state;
    if (!err) {
      const res = await login(values)
      if(res.code === 0) {
        localStorage.setItem('fruit_token', res.data)
        message.success(res.msg, 2, () => {
          router.replace('/welcome')
        })
      } else {
        message.error(res.msg, 2)
      }
    }
  };


  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const { type } = this.state;
    // console.log(userLogin)
    return (
      <div className={styles.main}>
        {/* <div className={styles.container}> */}
          <LoginComponents
            defaultActiveKey={type}
            onSubmit={this.handleSubmit}
            ref={(form: any) => {
              this.loginForm = form;
            }}
          >
            <Tab key="account" tab='账号登录'>
              {status === 'error' &&
                !submitting &&
                this.renderMessage(
                  formatMessage({ id: 'userlogin.login.message-invalid-credentials' }),
                )}
              <UserName
                name="username"
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名必填',
                  },
                ]}
              />
              <Password
                name="password"
                placeholder={`请输入密码`}
                rules={[
                  {
                    required: true,
                    message: '密码必填',
                  },
                ]}
                onPressEnter={e => {
                  e.preventDefault();
                  if (this.loginForm) {
                    this.loginForm.validateFields(this.handleSubmit);
                  }
                }}
              />
            </Tab>
            <Submit loading={submitting}>
              <FormattedMessage id="userlogin.login.login" />
            </Submit>
          </LoginComponents>

        {/* </div> */}
        
      </div>
    );
  }
}

export default UserLogin;
