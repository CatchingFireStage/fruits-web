/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2021-08-28 08:08:15
 * @LastEditros: 
 * @LastEditTime: 2021-10-08 15:48:53
 */

import request from '@/utils/request';
import {PageParams} from "@/utils/request/params";
import { message } from 'antd';
import { SpecificationTableData, SpuListTableData } from './spu.dto';

// SPU分类-添加
export function addCategroy(data: any) {
  return request('/admin/spu/category', {
    method: 'post',
    data
  })
}

// SPU分类-列表
export function getCategoryList(params: any) {
  return request('/admin/spu/categories', {
    method: 'get',
    params
  })
}

// SPU分类-删除
export function deleteCategoryById(id: any) {
  return request(`/admin/spu/category/${id}`, {
    method: 'delete',
  })
}

// SPU分类-更新
export function editCategroy(data: any, id: string | number) {
  return request(`/admin/spu/category/${id}`, {
    method: 'put',
    data
  })
}

/**
 * @description SPU规格列表
 * @param params 请求参数
 * @returns callBack
 */
export async function specifications(params: any, callBack: (tableData: SpecificationTableData) => void) {
  let res = await request('/admin/spu/specifications', {
    method: 'get',
    params
  })

  if(res.code === 0) {
    

    return callBack({
      tableData: res.data.list,
      total: res.data.total
    })
  }
}


/**
 * 添加规格
 * @param data {name: string}
 * @returns 
 */
export async function addSpecification(data: { name: string }, callBack: () => void) {
  let res =  await request('/admin/spu/specification', {
    method: 'post',
    data
  })
  if(res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack()
    })
    
  }
}

/**
 * 更新规格
 * @param data {name: string}
 * @returns 
 */
export async function editSpecification(data: { name: string, id: number | undefined }, callBack: () => void) {
  let res =  await request(`/admin/spu/specification/${data.id}`, {
    method: 'put',
    data
  })
  if(res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack()
    })
  }
}

/**
 * 添加规格值
 * @param data {name: string, specificationId: number}
 * @returns callback: () => void
 */
export async function addSpecificationValue(data: 
  {
    value: string,
    specificationId: number
  }, callBack: () => void) {
  let res =  await request('/admin/spu/specificationValue', {
    method: 'POST',
    data
  })
  if(res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack()
    })
    
  }
}

/**
 * 更新规格
 * @param data {name: string}
 * @returns 
 */
export async function editSpecificationValue(data: 
  {
    id: number | undefined,
    specificationId: number,
    money: number,
    value: string 
  }, callBack: () => void) {
  let res =  await request(`/admin/spu/specificationValue/${data.id}`, {
    method: 'put',
    data
  })
  if(res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack()
    })
  }
}


// SPU规格值-删除
export async function delSpecificationValue(id: number, callBack: () => void) {
  let res = await request(`/admin/spu/specificationValue/${id}`, {
    method: 'delete',
  })
  
  if(res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack()
    })
  }
}


/**
 * @description SPU列表
 * @param params 请求参数
 * @returns callBack
 */
export async function spuList(params: PageParams, callBack: (tableData: SpuListTableData) => void) {
  let res = await request('/admin/spu/spu', {
    method: 'get',
    params
  })

  if(res.code === 0) {
    

    return callBack({
      tableData: res.data.list,
      total: res.data.total
    })
  }
}

/**
 * 
 * @param id 商品ID
 * @param callBack 更新商品详情
 * @returns 
 */
export async function spuDetail(id: number, callBack: (detail: any) => void) {
  let res = await request(`/admin/spu/sup/${id}`, {
    method: 'get',
    params: {}
  })

  if(res.code === 0) {
    

    return callBack(res.data)
  }
}

/**
 * @desc 新增SPU
 * @param data {}
 * @param callBack 新增
 * @returns 
 */
export async function addSpu(data: FormData, callBack: (res: any) => void) {
  let res = await request(`/admin/spu/spu`, {
    method: 'POST',
    data
  })

  if(res.code === 0) {
    
    callBack(res)
  }
}

/**
 * @desc 更新SPU
 * @param data {}
 * @param callBack 
 * @returns 
 */
export async function updateSpu(data: any, callBack: (res: any) => void) {
  let res = await request(`/admin/spu/spu/${data.id}`, {
    method: 'POST',
    data: data.reqData
  })

  if(res.code === 0) {
    
    // message.success(res.msg, 2, () => {
    //   router.push('/spu/list')
    // })
    callBack(res)
  }
}


// 绑定规格关联
export async function addSpecificationSpu(data: {
  spuId: number,
  required: number,
  specificationId: number | undefined,
}, callback: () => void) {
  let res = await request(`/admin/spu/specificationSpu`, {
    method: 'POST',
    data
  })

  if(res.code === 0) {
    message.success(res.msg, 2, () => {
      callback()
    })
    
  }
}


/**
 * 更新规格
 * @param data {required: number, id: number}
 * @returns 
 */
export async function updateSpecificationSpu(data: { required: number, id: number}, callBack: () => void) {
  let res =  await request(`/admin/spu/specificationSpu/${data.id}`, {
    method: 'put',
    data
  })
  if(res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack()
    })
  }
}


export async function delSpecificationSpu(id: number, callBack: () => void) {
  let res =  await request(`/admin/spu/specificationSpu/${id}`, {
    method: 'delete',
  })
  if(res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack()
    })
  }
}

export async function delSpu(id: number, callBack: () => void) {
  let res =  await request(`/admin/spu/spu/${id}`, {
    method: 'delete',
  })
  if(res.code === 0) {
    message.success(res.msg, 1, () => {
      callBack()
    })
  }
}