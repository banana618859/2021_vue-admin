/*
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2019-09-12 17:11:27
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-03-18 22:30:46
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: '库存管理',
    icon: 'table'
  },
  children: [
    {
      path: 'intable',
      component: () => import('@/views/table/intable'),
      name: 'intable',
      meta: { title: '商品入库' }
    },
    {
      path: 'outtable',
      component: () => import('@/views/table/outtable'),
      name: 'InlineEditTable',
      meta: { title: '商品出库' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: '库存盘点' }
    }
  ]
}
export default tableRouter
