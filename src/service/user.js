import request from "./request";
import { api } from "@/config/index";
let token = localStorage.getItem("token")
export default class AuthApiService {
    //账户列表
    static getUserList(pageNo, pageSize) {
        return request.get(api.adminUrl + `manager/user/selectPage?pageNo=${pageNo}&pageSize=${pageSize}`, "", { headers: { "token": token } });
    }

     //新增账号
     static addUser(data) {
        return request.post(api.adminUrl + `/manager/user`, data, { headers: { "token": token } });
    }

     //删除账号
    //  static addUser(data) {
    //     return request.post(api.adminUrl + `/manager/user`, data, { headers: { "token": token } });
    // }

}