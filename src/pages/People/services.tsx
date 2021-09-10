import request from '@/utils/request';
import {UserListDTO, UserDTO} from "@/pages/People/dto/UserListDTO";


//用户列表页
//p 第几页
//keyword 搜索的关键字
//callback 回调函数
export function getUserList(params: {
  p: number,
  pageSize?: number,
  keyword?: string,
}, callback: (userListDTO: UserListDTO) => void) {


  request("/admin/user/user", {
    method: 'get',
    params
  }).then(response => {
    if (response.code == 0) {
      let userDTOArray: Array<UserDTO> = []


      response.data.list.forEach((item: any) => {
        userDTOArray.push({
          id: item.id,
          phone: item.phone
        })
      })

      let userListDTO: UserListDTO = {
        userDTOList: userDTOArray,
        total: response.data.total
      }

      return userListDTO;
    }
    throw new Error("请求失败" + response.msg);
  }).then(userListDTO => {
    callback(userListDTO)
  });
}
