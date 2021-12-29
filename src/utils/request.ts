/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-06-21 10:15:17
 * @LastEditros:
 * @LastEditTime: 2021-12-29 10:29:42
 */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';

/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  const { response, data } = error;
  if (response && response.status) {
    notification.error({
      message: `请求错误`,
      description: data.message,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use((url, options: any) => {
  options.headers = {
    'access-token-admin': localStorage.getItem('fruit_token'),
  };
  return {
    url,
    options: { ...options },
  };
});

request.interceptors.response.use((response: any) => {
  const { status } = response;
  if (status === 403) {
    // 没有权限
    router.replace('/404');
    // @HACK
    /* eslint-disable no-underscore-dangle */
    return;
  }
  if (status === 401) {
    router.replace('/user/login')
    // @HACK
    /* eslint-disable no-underscore-dangle */
    return;
  }

  return response;
});

export default request;
