/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2020-09-07 21:46:05
 * @LastEditros:
 * @LastEditTime: 2021-08-12 17:16:53
 */

import { constantRoutes } from '@/router'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */

const state = {
  routes: constantRoutes,
  addRoutes: constantRoutes
}

export default {
  namespaced: true,
  state
}
