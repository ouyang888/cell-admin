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


  //样品列表
  static sampleList(pageNo, pageSize) {
    return request.get(api.adminUrl + `manager/sample?pageNo=${pageNo}&pageSize=${pageSize}`, "", { headers: { "token": token } });
  }

  //新增样品
  static addSample(data) {
    return request.post(api.adminUrl + `manager/sample`, data, { headers: { "token": token } });
  }

  // 品牌下拉列表
  static brandChange() {
    return request.get(api.adminUrl + `manager/brand`, "", { headers: { "token": token } });
  }

  // 样品分类下拉列表
  static sampleType() {
    return request.get(api.adminUrl + `manager/sample/type`, "", { headers: { "token": token } });
  }

  // 样品管理 -- 分类管理
  static typeSelectPage(pageNo, pageSize) {
    return request.get(api.adminUrl + `manager/sample/type/selectPage?pageNo=${pageNo}&pageSize=${pageSize}`, "", { headers: { "token": token } });
  }


  //新增样品管理 -- 分类管理
  static addSampleTyple(data) {
    return request.post(api.adminUrl + `manager/sample/type`, data, { headers: { "token": token } });
  }

  //删除样品管理 -- 分类管理
  static delSampleTyple(data) {
    return request.post(api.adminUrl + `manager/sample/delete`, data, { headers: { "token": token } });
  }

   //修改样品管理 -- 分类管理
   static editSampleTyple(data) {
    return request.post(api.adminUrl + `manager/sample/type/update`, data, { headers: { "token": token } });
  }

}  