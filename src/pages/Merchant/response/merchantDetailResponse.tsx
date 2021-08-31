/**
 * 商家详情接口的返回
 */
import moment from "moment";

export default class MerchantDetailResponse {

  //格式化时间格式
  static _format:string = 'HH:mm';


  static get format(): string {
    return this._format;
  }

  static set format(value: string) {
    this._format = value;
  }

  get startTime(): Date {
    return this._startTime as Date;
  }

  set startTime(value: Date) {
    this._startTime = value;
  }

  get endTime(): Date {
    return this._endTime as Date;
  }

  set endTime(value: Date) {
    this._endTime = value;
  }

  get is24Hours(): boolean {
    return this._is24Hours;
  }

  set is24Hours(value: boolean) {
    this._is24Hours = value;
  }

  get isClose(): boolean {
    return this._isClose;
  }

  set isClose(value: boolean) {
    this._isClose = value;
  }

  private _startTime?: Date;
  private _endTime?: Date;
  private _is24Hours: boolean;
  private _isClose: boolean

  constructor() {
    this._is24Hours = false
    this._isClose = false
  }


  getStartTimeMomentFormat():string{
    return moment(this._startTime).format(MerchantDetailResponse._format)
  }

  getEndTimeMomentFormat():string{
    return moment(this._endTime).format(MerchantDetailResponse._format)
  }


}
