import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview =
  ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },

      locale: {
        enable: false,
        default: 'zh-CN', //默认语言 zh-CN，如果 baseSeparator 设置为 _，则默认为 zh_CN
        baseNavigator: true, // 为true时，用navigator.language的值作为默认语言
        // antd: true, // 是否启用antd的<LocaleProvider />
        baseSeparator: '-', // 语言默认分割符 -
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },

      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    // 登录注册

    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: '登录页',
          icon: 'smile',
          path: '/user/login',
          component: './User/UserLogin',
        },
      ],
    }, //北分资料

    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        {
          path: '/',
          redirect: '/welcome',
        },
        {
          path: '/welcome',
          name: '欢迎页面',
          icon: 'icon-huanyingye',
          component: './Welcome',
        },
        {
          path: '/order',
          name: '订单管理',
          icon: 'icon-quanbudingdan',
          routes: [
            {
              name: '制作中订单',
              path: '/order/index',
              component: './Order/index',
            },
            {
              name: '历史订单',
              path: '/order/history',
              component: './Order/history',
            },
          ],
        },
        {
          path: '/people',
          name: '用户管理',
          icon: 'icon-yonghu',
          component: './People',
        },
        {
          path: '/spu',
          name: 'SPU管理',
          icon: 'icon-SPUguanli',
          routes: [
            {
              name: '商品管理',
              path: '/spu/list',
              component: './spu/list',
            },
            {
              name: '商品详情',
              hideInMenu: true,
              path: '/spu/list/detail',
              component: './spu/list/detail',
            },
            {
              name: '分类管理',
              path: '/spu/category',
              component: './spu/category',
            },
            {
              name: '规格管理',
              path: '/spu/specification',
              component: './spu/specification',
            },
          ],
        },
        {
          path: '/merchant',
          name: '商家管理',
          icon: 'icon-shangjialiebiaoicon',
          component: './Merchant',
        },
        {
          component: './404',
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  proxy: {
    '/admin/': {
      target: 'http://106.12.76.73:8081/admin',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/admin': '',
      },
    },
  },
  history: 'hash',
  treeShaking: true,
  publicPath: '/fruit_admin/',
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
} as IConfig;
