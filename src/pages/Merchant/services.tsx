import request from '@/utils/request';
import MerchantDetailResponse from "@/pages/Merchant/response/merchantDetailResponse";
import moment from "moment";


//商家详情
export function getMerchant():Promise<any>{
  return request('/admin/merchant/merchant', {
    method: 'get'
  })
}

//商家详情更新
export function updateMerchant(merchantDetailResponse: MerchantDetailResponse):Promise<any>{
  return request('/admin/merchant/merchant', {
    method: 'post',
    data: {
      startTime: moment(merchantDetailResponse.startTime).format("YYYY-MM-DD HH:mm:ss"),
      endTime: moment(merchantDetailResponse.endTime).format("YYYY-MM-DD HH:mm:ss"),
      isClose: merchantDetailResponse.isClose,
      is24Hours: merchantDetailResponse.is24Hours
    }
  })
}
