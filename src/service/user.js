import request from "./request";
import { api } from "@/config/index";
let token = localStorage.getItem("token")
export default class AuthApiService {
    //账户列表
    static getUserList(pageNo, pageSize,queryParam) {
        return request.get(api.adminUrl + `manager/user/selectPage?pageNo=${pageNo}&pageSize=${pageSize}&queryParam=${queryParam}`);
    }

     //新增账号
     static addUser(data) {
        return request.post(api.adminUrl + `/manager/user`, data);
    }

     //删除账号
     static delUser(data) {
        return request.post(api.adminUrl + `/manager/user/delete`, data);
    }


      //修改账号
      static updateUser(data) {
        return request.post(api.adminUrl + `/manager/user/update`, data);
    }

}