/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import { CheckCircleOutlined } from '@ant-design/icons';

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';

import React, { useEffect } from 'react';
import { Link, router } from 'umi';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Result, Button, message, Icon } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2875298_9jv47h05imq.js', // 在 iconfont.cn 上生成
});

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };

  settings: Settings;
  loading: any;
  local: 'zh-CN';
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: any): any[] =>
  // console.log(menuDataRender)

  menuList.map((item: any) => {
    const localItem = {
      ...item,
      // icon: item.icon && IconMap[item.icon as string],
      icon: item.icon && <MyIcon type={item.icon} />,
      name: item.name,
      path: item.path,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return localItem as MenuDataItem;
  });

const defaultFooterDom = (
  <DefaultFooter copyright="2021 LaughingZhu Publish" links={[]} />
);

const footerRender: BasicLayoutProps['footerRender'] = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }
  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a
          href="https://www.netlify.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { dispatch, children, settings, location = { pathname: '/' } } = props;
  /**
   * constructor
   */
  useEffect(() => {
    const token = localStorage.getItem('fruit_token');
    if (token === undefined || token === null || token === '') {
      message.warning('您还未登录', 2, () => {
        router.replace('/user/login');
      });
    }
  }, [props]);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  // get children authority
  const authorized = getAuthorityFromRouter(
    props.route.routes,
    location.pathname || '/',
  ) || {
    authority: undefined,
  };

  return (
    <>
      <ProLayout
        locale="zh-CN"
        logo={
          'https://sckc-1256037416.cos.ap-beijing.myqcloud.com/next-admin/logo.jpg'
        }
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps: any, defaultDom) => {
          // if (menuItemProps.isUrl) {
          //   return defaultDom;
          // }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => {
          return [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            ...routers,
          ];
        }}
        footerRender={footerRender}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);

const IconMap = {
  welcome: <CheckCircleOutlined />,
};
