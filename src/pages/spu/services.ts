/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2021-08-28 08:08:15
 * @LastEditros: 
 * @LastEditTime: 2021-09-23 11:39:49
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
export async function specifications(params: PageParams, callBack: (tableData: SpecificationTableData) => void) {
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

