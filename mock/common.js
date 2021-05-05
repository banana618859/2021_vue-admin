/*
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2021-03-19 14:28:37
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-03-19 17:58:13
 */


let list = [{
  id: 1,
  name: '苹果',
  price: 8,
  unit: '斤',
  count: 5,
  createPerson:'张三',
  createTime: 1615986140867
},
{
  id: 2,
  name: '钢笔',
  price: 1.5,
  unit: '支',
  count: 6,
  createPerson:'张三',
  createTime: 1615986160867
},{
      id: 3,
      name: '香蕉',
      price: 2,
      unit: '条',
      count: 6,
      createPerson:'张三',
      createTime: 1615986160867
    }]


export default [
  // user login
  {
    url: '/common/getInList',
    type: 'post',
    response: config => {
      console.log('config.body',config.body);

      // // mock error
      // if (!token) {
      //   return {
      //     code: 60204,
      //     message: 'Account and password are incorrect.'
      //   }
      // }
      return {
        code: 20000,
        data: list
      }
    }
  }
]