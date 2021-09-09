/**
 * 用户列表dto
 */
export  interface UserListDTO extends Total{
  userDTOList:UserDTO[]
}

export interface Total {
  //总数
  total:number,
}


/**
 * 用户dto
 */
export interface UserDTO {
  id: number
  phone: string
}
