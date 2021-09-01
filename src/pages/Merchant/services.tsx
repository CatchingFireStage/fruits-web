import request from '@/utils/request';
import moment from "moment";


//商家详情
export function getMerchant():Promise<any>{
  return request('/admin/merchant/merchant', {
    method: 'get'
  })
}

//商家详情更新
export function updateMerchant(merchantDetailDTO:any):Promise<any>{
  return request('/admin/merchant/merchant', {
    method: 'post',
    data: {
      startTime: moment(merchantDetailDTO.startTime).format("YYYY-MM-DD HH:mm:ss"),
      endTime: moment(merchantDetailDTO.endTime).format("YYYY-MM-DD HH:mm:ss"),
      isClose: merchantDetailDTO.isClose,
      is24Hours: merchantDetailDTO.is24Hours
    }
  })
}
