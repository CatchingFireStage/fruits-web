import request from '@/utils/request';
import {UserListDTO, UserDTO} from "@/pages/People/dto/UserListDTO";


//商家详情
export function getUserList(p: number, keyword: string, callback: (userListDTO: UserListDTO) => void) {

  let urlSearchParams = new URLSearchParams();

  urlSearchParams.set("p", p.toString());
  urlSearchParams.set("pageSize","1");

  if (keyword.length > 0) {
    urlSearchParams.set("keyword", keyword);
  }


  request("/admin/user/user?" + urlSearchParams.toString(), {
    method: 'get'
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
