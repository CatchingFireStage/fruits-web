/*
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-09-14 09:58:02
 * @LastEditros:
 * @LastEditTime: 2021-10-20 15:47:06
 */
import request from '@/utils/request';
import moment from 'moment';
import { MerchantDetailDTO } from '@/pages/Merchant/dto/MerchantDetailDTO';
import { message } from 'antd';

//商家详情
export function getMerchant(
  callback: (merchantDetailDTO: MerchantDetailDTO) => void,
) {
  request('/admin/merchant/merchant', {
    method: 'get',
  })
    .then((response) => {
      if (response.code == 0) {
        let dto: MerchantDetailDTO = {
          startTime: new Date(response.data.startTime),
          endTime: new Date(response.data.endTime),
          is24Hours: response.data.is24Hours,
          isClose: response.data.isClose,
        };
        return dto;
      }
      throw new Error('请求失败' + response.msg);
    })
    .then((merchantDetailDTO) => {
      callback(merchantDetailDTO);
    });
}

//商家详情更新
export function updateMerchant(merchantDetailDTO: MerchantDetailDTO) {
  request('/admin/merchant/merchant', {
    method: 'post',
    data: {
      startTime: moment(merchantDetailDTO.startTime).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      endTime: moment(merchantDetailDTO.endTime).format('YYYY-MM-DD HH:mm:ss'),
      isClose: merchantDetailDTO.isClose,
      is24Hours: merchantDetailDTO.is24Hours,
    },
  }).then((response) => {
    if (response.code == 0) {
      message.info('保存成功');
      return;
    }
    message.error('保存失败' + response.msg);
    throw new Error('请求失败' + response.msg);
  });
}

export function deskQrcode(params: { desk: string }, callBack: any) {
  request('/admin/merchant/deskQrCode', {
    method: 'get',
    params,
  }).then((response) => {
    if (response.code === 0) {
      return callBack(response);
    }
    throw new Error('请求失败' + response.msg);
  });
}
