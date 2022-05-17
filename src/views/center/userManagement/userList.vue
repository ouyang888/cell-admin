<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">客户列表</div>
                    <div class="headerSearch">
                        <a-select ref="select" @change="changeBrandId" default-value=""
                                  style="width: 160px;margin-right: 10px;">
                            <a-select-option value="">请选择</a-select-option>
                            <a-select-option v-for="(item, index) in brandArr" :key="index" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                        <a-select ref="select" @change="changeSalesArea" default-value=""
                                  style="width: 160px;margin-right: 10px;">
                            <a-select-option value="">请选择</a-select-option>
                            >
                            <a-select-option v-for="(item, index) in salesAreaArr" :key="index" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                        <a-input-search v-model="searchVlaue" @search="userInfo" placeholder="用户名、手机号"
                                        enter-button="搜索"/>
                    </div>
                </div>
            </div>
            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary" @click="addHandle()">添加</a-button>
                    <a-button type="danger" style="margin-left: 10px;" @click="delMoreHandle">批量删除</a-button>
                </div>
                <a-table rowKey="id" :pagination="false" :data-source="dataSource" :columns="columns"
                         :loading="isloading" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                         :scroll="{ x: 1400, y: 1300 }">

                    <template slot="storeSpace" style="min-width: 100px" slot-scope="storeSpace">
                        {{ storeSpace }}平方米
                    </template>
                    <template slot="wechat" slot-scope="wechat">
                        <img style="width: 40px;height: 40px;border-radius: 50%;" :src="wechat.wxHeadImg" alt="">{{
                        wechat.wxNickName
                        }}
                    </template>

                    <template slot="state" slot-scope="state">
                        {{ state == "A" ? '已启用' : '已禁用' }}
                    </template>

                    <template slot="operation" slot-scope="text,lineData">
                        <div class="flex j-ey a-c">
                            <a @click="gotoSample(lineData)">样品清单</a>
                            <a @click="changeState(lineData)">{{ lineData.state == "A" ? '禁用' : '可用' }}</a>
                            <a @click="editUser(lineData)">编辑</a>
                            <a style="color:red" @click="showDelModal(lineData.id)">删除</a>
                        </div>
                    </template>
                </a-table>
                <div class="flex j-e a-c pagination-wrapper">
                    <span style="margin-right: 10px"> 合计{{ totalCount }}条 </span>
                    <a-pagination class="flex j-e pagination" v-model="pageNo" :total="totalCount" :locale="locale"
                                  show-less-items @change="changePage" @showSizeChange="couponSizeChange"/>
                </div>
            </div>
        </div>

        <!--   删除     -->
        <a-modal @ok="delAccount" v-model="deleteOpen" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>

        <!-- 新增客户 -->
        <a-modal cancelText="取消" @ok="addCustomerInfo" okText="保存" :title="isAdd?'添加用户':'编辑用户'" v-model="addUser">
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">品牌名称：</div>
                <a-select @change="changeBrandId" v-model="accountForm.brandId" ref="select" default-value="" style="width: 100%;">
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="(item, index) in brandArr" :key="index" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">分销级别：</div>
                <a-radio-group v-model="accountForm.salesLevel" name="radioGroup" style="width: 100%;">
                    <a-radio value="2">二级分销</a-radio>
                    <a-radio value="3">三级分销</a-radio>
                </a-radio-group>
            </div>
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">分销区域：</div>
                <a-select v-model="accountForm.salesAreaId" @change="changeSalesArea" ref="select" default-value="" style="width: 100%;">
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="(item, index) in salesAreaArr" :key="index" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">客户名：</div>
                <a-input v-model="accountForm.name" placeholder="请输入客户名"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">手机号码：</div>
                <a-input v-model="accountForm.phone" placeholder="请输入手机号码"></a-input>
            </div>

            <div class="flex j-c a-c" style="margin-top: 20px;align-items: start">
                <div style="width: 100px">门店地址：</div>
                <div style="width:100%">
                    <div style="display: flex;margin-bottom: 10px;">
                        <v-distpicker :province="selected.province" :city="selected.city" :area="selected.area"
                                      @selected="onSelectedAddress"></v-distpicker>
                    </div>
                    <div>
                        <a-input v-model="accountForm.detailedAddress" placeholder="请输入详细地址"></a-input>
                    </div>
                </div>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">店面面积：</div>
                <a-input v-model="accountForm.storeSpace" placeholder="13.3" addon-after="平方米"></a-input>
            </div>


            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">状态：</div>
                <a-radio-group v-model="accountForm.state" name="radioGroup" style="width: 100%;">
                    <a-radio value="A">启用</a-radio>
                    <a-radio value="D">禁用</a-radio>
                </a-radio-group>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
    import API from "../../../service/api";
    import VDistpicker from 'v-distpicker';

    export default {
        components: {VDistpicker},
        data() {
            let columns = [
                {
                    title: "客户ID",
                    width: "180px",
                    dataIndex: "id",
                },
                {
                    title: "客户代码",
                    width: "90px",
                    dataIndex: "customerCode",
                },
                {
                    title: "客户名",
                    dataIndex: "name",
                    width: "100px",
                    scopedSlots: {customRender: "name"},
                },
                {
                    title: "手机号码",
                    dataIndex: "phone",
                    scopedSlots: {customRender: "phone"},
                    width: 120,
                },
                {
                    title: "门店地址",
                    dataIndex: "storeAddress",
                    scopedSlots: {customRender: "storeAddress"},
                    width: 120,
                },
                {
                    title: "店面面积",
                    dataIndex: "storeSpace",
                    scopedSlots: {customRender: "storeSpace"},
                    width: 120,
                },
                {
                    title: "分销区域",
                    dataIndex: "salesArea",
                    scopedSlots: {customRender: "salesArea"},
                    width: 120,
                },
                {
                    title: "样品数",
                    dataIndex: "sample",
                    scopedSlots: {customRender: "sample"},
                    width: 120,
                },
                {
                    title: "微信",
                    // dataIndex: "wechat",
                    width: "120px",
                    scopedSlots: {customRender: "wechat"},
                },
                {
                    title: "状态",
                    width: 180,
                    dataIndex: "state",
                    scopedSlots: {customRender: "state"},
                },
                {
                    title: "操作",
                    width: "220px",
                    fixed: "right",
                    scopedSlots: {customRender: "operation"},
                },
            ];
            columns = columns.map((item) => {
                return {...item, align: "center"};
            });
            return {
                isAdd: false,
                value1: '',
                searchdata: {},
                totalCount: 0,
                locale: zhCN, //中文
                value: '',
                addUser: false,
                isloading: false,
                contentHeight: 0,
                dataSource: [],
                count: 2,
                columns: columns,
                // new
                selectedRowKeys: [],
                deleteOpen: false,
                addUserList: {},
                pageNo: 1,
                pageSize: 10,
                searchVlaue: "",
                brandArr: [],
                salesAreaArr: [],
                selected: {
                    province: "",
                    city: "",
                    area: ""
                },
                accountForm: {
                    brandId: "",
                    salesAreaId: ""
                },
                ids: []
            }
        },

        mounted() {
            this.userInfo();
            this.showBrand();
            this.showSalesArea();
        },

        computed: {
            fullAddress: function () {
                return this.selected.province + "," + this.selected.city + "," + this.selected.area
            }
        },

        methods: {
            addHandle() {
                this.accountForm = {};
                this.selected.province = null
                this.selected.city = null
                this.selected.area = null
                this.addUser = this.isAdd = true
            },
            gotoSample(item) {
                this.$router.push({path: "/center/sample", query: item});
            },
            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys;
            },

            //选择品牌名称
            changeBrandId(value) {
                this.accountForm.brandId = value
            },
            //选择分销区域
            changeSalesArea(value) {
                this.accountForm.salesAreaId = value
            },
            // 分页改变
            changePage(page) {
                this.pageNo = page;
                this.userInfo();
            },
            // 分页的回调
            couponSizeChange(current, size) {
                this.pageNo = 1;
                this.pageSize = size;
                this.userInfo();
            },
            // 批量删除
            delMoreHandle() {
                if (this.selectedRowKeys.length <= 0) {
                    this.$message.warning("请选择要删除条目", 1);
                    return
                }
                this.showDelModal(this.selectedRowKeys)
            },
            //删除弹出
            showDelModal(id) {
                this.ids = []
                this.deleteOpen = true;
                Array.isArray(id) ? this.ids = id : this.ids.push(id);
            },
            //列表
            async userInfo() {
                let res = await API.customerList(this.pageNo, this.pageSize, this.searchVlaue, this.accountForm.brandId, this.accountForm.salesAreaId);
                this.dataSource = res.data.records;
                this.totalCount = res.data.total
            },

            //点击可用禁用
            async changeState(item) {
                let res = await API.getCustomerDetail(item.id);
                item.state == "D" ? res.data.state = "A" : res.data.state = "D"
               await API.updateCustomer(res.data);
                if (res.errorCode == 0) {
                    this.$message.success("修改成功", 1);
                    this.userInfo();
                }
            },

            //确定 新增/编辑 客户
            async addCustomerInfo() {
                let res;
                this.accountForm.storeAddress = this.fullAddress
                if (this.accountForm.id) {
                    res = await API.updateCustomer(this.accountForm);
                } else {
                    res = await API.addCustomer(this.accountForm);
                }

                if (res.errorCode == 0) {
                    this.$message.success(this.isAdd ? "添加成功" : "编辑成功", 1);
                    this.accountForm = {
                        brandId: "",
                        salesAreaId: ""
                    }
                    this.addUser = false;
                    this.userInfo();
                } else {
                    this.$message.error(res.msg);
                }
            },

            //点击编辑
            async editUser(item) {
                let res = await API.getCustomerDetail(item.id);
                this.addUser = true
                this.isAdd = false
                this.accountForm = res.data
                let arr = res.data.storeAddress.split(",");
                this.selected.province = arr[0];
                this.selected.city = arr[1];
                this.selected.area = arr[2];
            },

            //删除客户
            async delAccount() {
                let res = await API.delCustomer(this.selectedRowKeys.length != 0 ? this.selectedRowKeys : this.ids);
                if (res.errorCode == 0) {
                    this.$message.success("删除成功", 0.5);
                    this.selectedRowKeys = [];
                    this.ids = [];
                    this.userInfo();
                    this.deleteOpen = false;
                } else {
                    this.$message.error(res.msg, 1);
                }
            },

            //品牌列表
            async showBrand() {
                let res = await API.brandChange();
                if (res.errorCode == 0) {
                    this.brandArr = res.data
                }
            },
            //分销区域列表
            async showSalesArea() {
                let res = await API.salesArea(1);
                if (res.errorCode == 0) {
                    this.salesAreaArr = res.data
                }
            },

            //省市区联动
            onSelectedAddress(data) {
                const {province, city, area} = data;
                if (!province.code && !city.code && !city.code) return;
                this.selected.province = province.value;
                this.selected.city = city.value;
                this.selected.area = area.value;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .manageHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .headerSearch {
        display: flex;
    }

    .manageAll {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 20px;
    }

    .pagination-wrapper {
        margin-top: 10px;
        padding-bottom: 10px;

        .pagination {
            margin-right: 11px;
        }
    }

    ::v-deep.distpicker-address-wrapper select {
        height: 34px;
        padding: 0;
        width: 127px;
    }
</style>
