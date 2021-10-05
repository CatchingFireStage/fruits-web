/*
 * @Description: 
 * @Author: LaughingZhu
 * @Date: 2021-09-13 10:15:23
 * @LastEditros: 
 * @LastEditTime: 2021-09-23 11:39:39
 */
export interface SpecificationTableData {
  tableData: [
    {
      id: number;
      value: string;
      required: boolean | null;
      values: [
        {
          id: number;
          value: string;
          money: string
        }
      ] | null
    }
  ] | [] | null;
  total: number
}

export interface SpuListTableData {
  tableData: [
    {
      id: number;
      value: string;
      required: boolean | null;
      values: [
        {
          id: number;
          value: string;
          money: string
        }
      ] | null
    }
  ] | [] | null;
  total: number
}