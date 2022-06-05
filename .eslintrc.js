// module.exports = {
//   extends: [require.resolve('@umijs/fabric/dist/eslint')],
//   globals: {
//     ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
//     page: true,
//   },
// };
module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // 影响正常使用
    // this 绑定，hooks不实用this获取组件实例，故取消
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/unbound-method': 0,
    // 既然写了ts-ignore,理论上确实需要ignore,故取消
    '@typescript-eslint/ban-ts-comment': 0,
    // ++ 运算， for 循环中的++关闭
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    // props没有默认值
    'react/require-default-props': 0,
    // 我们更推荐命名导出
    'import/prefer-default-export': 0,
    // 单行字符长度, 忽略模版字符串和url的行
    'max-len': [
      'warn',
      { code: 200, ignoreTemplateLiterals: true, ignoreUrls: true },
    ],
    // 不允许使用for of
    'no-restricted-syntax': 0,
    // 含有onclick事件的元素需要带有onkey 事件监听。
    'jsx-a11y/click-events-have-key-events': 0,
    // jsx中的...rest展开符
    'react/jsx-props-no-spreading': 0,
    // 不被允许使用自动聚焦
    'jsx-a11y/no-autofocus': 0,
    // 非交互元素不被允许使用事件
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    // ts隐式推断不被接收
    'react/prop-types': 0,
    // 模版字符串被认定为arraykey
    'react/no-array-index-key': 0,
    // sfc 和 mobx提供的localstore 冲突， localstore中可使用this
    'react/no-this-in-sfc': 0,
    // void
    '@typescript-eslint/no-floating-promises': 0,
    // ts-no-unused-vars 无法正确识别导出namespace
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars-experimental': 1,
    // div绑定事件后，需要分配角色。
    'jsx-a11y/no-static-element-interactions': 0,
    // no-void
    'no-void': 0,

    // 可优化，或者采用下列role
    // any太多， 暂时修改为warn
    '@typescript-eslint/restrict-template-expressions': 0,
    // any太多， 暂时修改为warn
    '@typescript-eslint/no-unsafe-call': 0,
    // styles 没有类型定义
    '@typescript-eslint/no-unsafe-member-access': 1,
    // 返回void检测， 类似makeStyles存在问题。
    '@typescript-eslint/no-unsafe-assignment': 1,
    // no-return
    '@typescript-eslint/no-unsafe-return': 1,
    // 函数体内使用&&运算符代替ifelse
    '@typescript-eslint/no-unused-expressions': 0,
    // 驼峰、连写检验
    '@typescript-eslint/naming-convention': 0,
    // 循环引用
    'import/no-cycle': 0,
    // 不允许函数提升的用法。
    '@typescript-eslint/no-use-before-define': 0,
    // 不允许在遍历中赋值，实际使用中存在。
    '@typescript-eslint/no-loop-func': 0,
    // 键值对返回空对象问题。 event.js ,考虑优化
    '@typescript-eslint/ban-types': 1,

    '@typescript-eslint/no-unsafe-member-access': 0,

    '@typescript-eslint/no-explicit-any': ['off'],

    // 只允许修改指定名称的参数
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'e', // for e.returnvalue
          'draft', // for immer
        ],
      },
    ],
  },
  globals: {
    xlog: true,
    Capture: true,
  },
};
