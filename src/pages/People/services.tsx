import request from '@/utils/request';
import {UserListDTO, UserDTO} from "@/pages/People/dto/UserListDTO";
import {PageParams} from "@/utils/request/params";


//请求用户列表的参数
interface RequestUserListParams extends PageParams {
  keyword?: string
}

//用户列表页
//params 请求参数
//callback 回调函数
export function getUserList(params: RequestUserListParams, callback: (userListDTO: UserListDTO) => void) {

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
