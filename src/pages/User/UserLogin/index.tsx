import { Alert } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password,  Submit } = LoginComponents;

interface UserLoginProps {
  dispatch: Dispatch<any>;
  userLogin: StateType;
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

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err: any, values: FormDataType) => {
    // const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userLogin/login',
        payload: {
          name: values.username,
          password: values.password
        },
      });
    }
  };


  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { userLogin, submitting } = this.props;
    const { status, userInfo } = userLogin;
    const { type, autoLogin } = this.state;
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

export default connect(
  ({
    userLogin,
    loading,
  }: {
    userLogin: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userLogin,
    submitting: loading.effects['userLogin/login'],
  }),
)(UserLogin);
