
import {Total} from "@/utils/dto/page";


/**
 * 用户列表dto
 */
export  interface UserListDTO extends Total{
  userDTOList:UserDTO[]
}


/**
 * 用户dto
 */
export interface UserDTO {
  id: number
  phone: string
}
