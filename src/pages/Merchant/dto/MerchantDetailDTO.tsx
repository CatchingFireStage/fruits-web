/**
 * 商家详情的dto,对应商家接口返回的字段
 */
export  interface MerchantDetailDTO {
    startTime: Date,
    endTime: Date,
    is24Hours: boolean,
    isClose: boolean
}
