<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">客户列表</div>
                    <div class="headerSearch">
                        <a-select ref="select" v-model="value1" style="width: 160px;margin-right: 10px;">
                            <a-select-option value="jack">全部</a-select-option>
                        </a-select>
                        <a-select ref="select" v-model="value1" style="width: 160px;margin-right: 10px;">
                            <a-select-option value="jack">全部</a-select-option>
                        </a-select>
                        <a-input-search v-model="value" placeholder="用户名、手机号" enter-button="搜索" />
                    </div>
                </div>
            </div>
            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary" @click="addUser = true">添加</a-button>
                    <a-button type="danger" style="margin-left: 10px;" @click="showDelModal">批量删除</a-button>
                </div>
                <a-table rowKey="id" :pagination="false" :data-source="dataSource" :columns="columns"
                    :loading="isloading" :row-selection="{ selectedRowKeys: selectedRowKeys }"
                    :scroll="{ x: 1500, y: 300 }">
                   
                    <template slot="storeSpace" style="min-width: 100px" slot-scope="storeSpace">
                        {{ storeSpace }}平方米
                    </template>
                    <template slot="wechat" style="min-width: 100px" slot-scope="wechat">
                        <img style="width: 40px;height: 40px;border-radius: 50%;" :src="wechat.wxHeadImg" alt="">{{ wechat.wxNickName }}
                    </template>

                    <template slot="operation">
                        <div class="flex j-ey a-c">
                            <a>样品清单</a>
                            <a>禁用</a>
                            <a>编辑 | </a>
                            <a>删除</a>
                        </div>
                    </template>
                </a-table>
                <div class="flex j-e a-c pagination-wrapper">
                    <span style="margin-right: 10px"> 合计{{ totalCount }}条 </span>
                    <a-pagination class="flex j-e pagination" :current="searchdata.num" :total="totalCount"
                        :locale="locale" show-size-changer @change="changePage" @showSizeChange="couponSizeChange" />
                </div>
            </div>
        </div>

        <!--   删除     -->
        <a-modal v-model="deleteOpen" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>

        <!-- 新增客户 -->
        <a-modal cancelText="取消" @ok="addCustomerInfo" okText="保存" title="添加用户" v-model="addUser">
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">品牌名称：</div>
                <a-select ref="select" v-model="value1" style="width: 100%;margin-right: 10px;">
                    <a-select-option value="jack">全部</a-select-option>
                </a-select>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">分销级别：</div>
                <a-radio-group v-model="value" name="radioGroup" style="width: 100%;">
                    <a-radio value="1">二级分销</a-radio>
                    <a-radio value="2">三级分销</a-radio>
                </a-radio-group>
            </div>
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">分销区域：</div>
                <a-select ref="select" v-model="value1" style="width: 100%;margin-right: 10px;">
                    <a-select-option value="jack">全部</a-select-option>
                </a-select>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">客户名：</div>
                <a-input v-model="addUserList.userName" placeholder="请输入姓名"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">手机号码：</div>
                <a-input v-model="addUserList.password" placeholder="请输入密码"></a-input>
            </div>

            <div class="flex j-c a-c" style="margin-top: 20px;align-items: start">
                <div style="width: 100px">门店地址：</div>
                <div>
                    <div style="display: flex;margin-bottom: 10px;">
                        <a-select ref="select" v-model="value1" style="width: 120px;margin-right: 10px;"
                            placeholder="省">
                            <a-select-option value="jack">全部</a-select-option>
                        </a-select>
                        <a-select ref="select" v-model="value1" style="width: 120px;margin-right: 10px;"
                            placeholder="市">
                            <a-select-option value="jack">全部</a-select-option>
                        </a-select>
                        <a-select ref="select" v-model="value1" style="width: 120px;margin-right: 10px;"
                            placeholder="区">
                            <a-select-option value="jack">全部</a-select-option>
                        </a-select>
                    </div>
                    <div>
                        <a-input v-model="addUserList.password" placeholder="请输入详细地址"></a-input>
                    </div>
                </div>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">店面面积：</div>
                <a-input v-model="addUserList.password" placeholder="13.3" addon-after="平方米"></a-input>
            </div>


            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">状态：</div>
                <a-radio-group v-model="value" name="radioGroup" style="width: 100%;">
                    <a-radio value="1">启用</a-radio>
                    <a-radio value="2">禁用</a-radio>
                </a-radio-group>
            </div>
        </a-modal>
    </div>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import API from "../../../service/api";
export default {
    data() {
        let columns = [
            {
                title: "客户ID",
                width: "90px",
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
                scopedSlots: { customRender: "name" },
            },
            {
                title: "手机号码",
                dataIndex: "phone",
                scopedSlots: { customRender: "phone" },
                width: 120,
            },
            {
                title: "门店地址",
                dataIndex: "storeAddress",
                scopedSlots: { customRender: "storeAddress" },
                width: 120,
            },
            {
                title: "店面面积",
                dataIndex: "storeSpace",
                scopedSlots: { customRender: "storeSpace" },
                width: 120,
            },
            {
                title: "分销区域",
                dataIndex: "salesArea",
                scopedSlots: { customRender: "salesArea" },
                width: 120,
            },
            {
                title: "样品数",
                dataIndex: "sample",
                scopedSlots: { customRender: "sample" },
                width: 120,
            },
            {
                title: "微信",
                dataIndex: "wechat",
                width: "120px",
                scopedSlots: { customRender: "wechat" },
            },
            {
                title: "状态",
                width: 180,
                dataIndex: "state",
                scopedSlots: { customRender: "state" },
            },
            {
                title: "操作",
                width: "190px",
                fixed: "right",
                scopedSlots: { customRender: "operation" },
            },
        ];
        columns = columns.map((item) => {
            return { ...item, align: "center" };
        });
        return {
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
        }
    },

    mounted() {
        this.userInfo();
    },

    methods: {
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
        //删除弹出
        showDelModal() {
            this.deleteOpen = true;
        },

        async userInfo() {
            let res = await API.customerList(this.pageNo, this.pageSize);
            this.dataSource = res.data.records;
            this.totalCount = res.data.total
        },

        async addCustomerInfo(){
             let res = await API.addCustomer(this.pageNo, this.pageSize);
        },

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
</style>
