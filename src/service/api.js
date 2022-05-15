import request from "./request";
import { api } from "@/config/index";
let token = localStorage.getItem("token")
export default class ApiService {
  static getApiPre(type) {
    switch (type) {
      case "admin":
        return api.adminUrl;
      default:
        return api.adminUrl;
    }
  }
  //登录
  static managerLogin(data) {
    return request.post(api.adminUrl + `Auth/manager/login`, data);
  }

  // 客户管理
  static customerList(pageNo, pageSize) {
    return request.get(api.adminUrl + `manager/customer/selectPage?pageNo=${pageNo}&pageSize=${pageSize}`, "", { headers: { "token": token } });
  }

  //新增客户
  static addCustomer(data) {
    return request.post(api.adminUrl + `manager/customer`, data);
  }


  // 品牌管理
  static brandList(pageNo, pageSize) {
    return request.get(api.adminUrl + `manager/brand/selectPage?pageNo=${pageNo}&pageSize=${pageSize}`, "", { headers: { "token": token } });
  }

  //新增品牌
  static addBrand(data) {
    return request.post(api.adminUrl + `manager/brand`, data, { headers: { "token": token } });
  }


  //分销区域管理
  static selectTreeList() {
    return request.get(api.adminUrl + `manager/sales/area/selectTree`, "", { headers: { "token": token } });
  }


}