import request from "./request";
import {api} from "@/config/index";

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
    static customerList(pageNo, pageSize, queryParam, brandId, salesAreaId) {
        return request.get(api.adminUrl + `manager/customer/selectPage?pageNo=${pageNo}&pageSize=${pageSize}&queryParam=${queryParam}&brandId=${brandId}&salesAreaId=${salesAreaId}`, "", {headers: {"token": token}});
    }

    //新增客户
    static addCustomer(data) {
        return request.post(api.adminUrl + `manager/customer`, data, {headers: {"token": token}});
    }

    //删除客户
    static delCustomer(data) {
        return request.post(api.adminUrl + `manager/customer/delete`, data, {headers: {"token": token}});
    }

    //修改客户
    static updateCustomer(data) {
        return request.post(api.adminUrl + `manager/customer/update`, data, {headers: {"token": token}});
    }

    // 获取客户详情
    static getCustomerDetail(id) {
        return request.get(api.adminUrl + `manager/customer/get?id=${id}`, "", {headers: {"token": token}});
    }


    // 品牌管理
    static brandList(pageNo, pageSize) {
        return request.get(api.adminUrl + `manager/brand/selectPage?pageNo=${pageNo}&pageSize=${pageSize}`, "", {headers: {"token": token}});
    }

    //删除品牌
    static delDrand(data) {
        return request.post(api.adminUrl + `manager/brand/delete`, data, {headers: {"token": token}});
    }

    //修改品牌状态
    static updateDrand(data) {
        return request.post(api.adminUrl + `manager/brand/update`, data, {headers: {"token": token}});
    }


    //新增品牌
    static addBrand(data) {
        return request.post(api.adminUrl + `manager/brand`, data, {headers: {"token": token}});
    }


    //分销区域管理
    static selectTreeList(pageNo, pageSize) {
        return request.get(api.adminUrl + `manager/sales/area/selectPage?pageNo=${pageNo}&pageSize=${pageSize}`);
    }


    //分销区域新增
    static addSalesArea(data) {
        return request.post(api.adminUrl + `manager/sales/area`, data);
    }


    //分销区域删除
    static delSalesArea(data) {
        return request.post(api.adminUrl + `manager/sales/area/delete`, data);
    }


    //样品列表
    static sampleList(pageNo, pageSize, queryParam) {
        return request.get(api.adminUrl + `manager/sample?pageNo=${pageNo}&pageSize=${pageSize}&queryParam=${queryParam}`);
    }

    //新增样品
    static addSample(data) {
        return request.post(api.adminUrl + `manager/sample`, data);
    }

    //修改样品
    static updateSample(data) {
        return request.post(api.adminUrl + `manager/sample/update`, data);
    }


    //删除样品
    static delSample(data) {
        return request.post(api.adminUrl + `manager/sample/delete`, data);
    }

    // 获取样品详情
    static sampleDetail(id) {
        return request.get(api.adminUrl + `manager/sample/get?id=${id}`);
    }


    // 品牌下拉列表
    static brandChange() {
        return request.get(api.adminUrl + `manager/brand`, "");
    }

    // 分销区域下拉列表
    static salesArea(level) {
        return request.get(api.adminUrl + `manager/sales/area?level=${level}`);
    }

    // 样品分类下拉列表
    static sampleType() {
        return request.get(api.adminUrl + `manager/sample/type`);
    }

    // 样品管理 -- 分类管理
    static typeSelectPage(pageNo, pageSize) {
        return request.get(api.adminUrl + `manager/sample/type/selectPage?pageNo=${pageNo}&pageSize=${pageSize}`);
    }


    //新增样品管理 -- 分类管理
    static addSampleTyple(data) {
        return request.post(api.adminUrl + `manager/sample/type`, data);
    }

    //删除样品管理 -- 分类管理
    static delSampleTyple(data) {
        return request.post(api.adminUrl + `manager/sample/type/delete`, data);
    }

    //修改样品管理 -- 分类管理
    static editSampleTyple(data) {
        return request.post(api.adminUrl + `manager/sample/type/update`, data);
    }


    //报备单管理 列表
    static filingSheetList(pageNo, pageSize, queryParam, nature, state) {
        return request.get(api.adminUrl + `manager/report/selectPage?pageNo=${pageNo}&pageSize=${pageSize}&queryParam=${queryParam}&nature=${nature}&state=${state}`);
    }

    //报备单管理 新增
    static filingSheetAdd(data) {
        return request.post(api.adminUrl + `manager/report`, data);
    }

    //报备单管理 删除
    static filingSheetDel(data) {
        return request.post(api.adminUrl + `manager/report/delete`, data);
    }

    //报备单管理 修改
    static filingSheetEdit(data) {
        return request.post(api.adminUrl + `manager/report/update`, data);
    }

    //报备单管理 更新状态
    static filingSheetUpdate(data) {
        return request.post(api.adminUrl + `manager/report/updateState`, data);
    }

    //报备单管理 确认延期
    static filingSheetDelay(data) {
        return request.post(api.adminUrl + `manager/report/confirmDelay`, data);
    }

    //报备单管理 获取报备单详情
    static filingSheetDetail(id) {
        return request.get(api.adminUrl + `manager/report/get?id=${id}`);
    }


    //销售渠道下拉列表
    static salesDownList() {
        return request.get(api.adminUrl + `manager/sales/channel`);
    }

    //销售渠道管理列表
    static salesChannelList(pageNo, pageSize, queryParam) {
        return request.get(api.adminUrl + `manager/sales/channel/selectPage?pageNo=${pageNo}&pageSize=${pageSize}&queryParam=${queryParam}`);
    }

    //销售渠道添加
    static addChannel(data) {
        return request.post(api.adminUrl + `manager/sales/channel`, data);
    }

    //销售渠道删除
    static delChannel(data) {
        return request.post(api.adminUrl + `manager/sales/channel/delete`, data);
    }


    //销售渠道修改
    static updateChannel(data) {
        return request.post(api.adminUrl + `manager/sales/channel/update`, data);
    }


    //销售单列表
    static salesList(pageNo, pageSize, queryParam, nature, state) {
        return request.get(api.adminUrl + `manager/sales/selectPage?pageNo=${pageNo}&pageSize=${pageSize}&queryParam=${queryParam}&nature=${nature}&state=${state}`);
    }

    //销售单详情
    static salesDetail(id) {
        return request.get(api.adminUrl + `manager/sales/get?id=${id}`);
    }

    //销售单 更新状态
    static salesUpdate(data) {
        return request.post(api.adminUrl + `manager/sales/updateState`, data);
    }

    //销售单 删除
    static salesDelete(data) {
        return request.post(api.adminUrl + `/manager/sales/delete`, data);
    }

    //销售渠道 修改
    static salesUpdateEdit(data) {
        return request.post(api.adminUrl + `manager/sales/update`, data);
    }

    //客户样品列表
    static selectCustomerSamplelList(pageNo, pageSize, customerId) {
        return request.get(api.adminUrl + `manager/sample/selectCustomerSample?pageNo=${pageNo}&pageSize=${pageSize}&customerId=${customerId}`);
    }

    //新增客户样品
    static sampleRelation(data) {
        return request.post(api.adminUrl + `manager/sample/relation`, data);
    }

    //分销区域下拉列表
    static salesAreaList() {
        return request.get(api.adminUrl + `manager/sales/selectPage`);
    }


}
