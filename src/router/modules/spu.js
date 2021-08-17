/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-08-17 09:41:12
 * @LastEditros:
 * @LastEditTime: 2021-08-17 16:50:03
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const spuRouter = {
  path: '/spu',
  component: Layout,
  redirect: 'noRedirect',
  name: 'spu',
  meta: {
    title: 'spu',
    icon: 'chart'
  },
  children: [
    {
      path: 'category',
      component: () => import('@/views/spu/category'),
      name: 'spu_category',
      meta: { title: 'spu_category', icon: 'international' }
    },
    {
      path: '/list',
      component: () => import('@/views/spu/index/index.vue'),
      name: 'spu_list',
      meta: { title: 'spu_list', icon: 'international' }
    }
  ]
}

export default spuRouter
