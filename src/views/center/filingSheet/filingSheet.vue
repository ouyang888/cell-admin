<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">报备单管理</div>
                    <div class="headerSearch">
                        <a-select :allowClear="true" ref="select" v-model="searchForm.state"
                            style="width: 160px;margin-right: 10px;">
                            <a-select-option v-for="(item, index) in selectList1" :key="index" :value="item.value">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                        <a-select ref="select" v-model="searchForm.nature" style="width: 160px;margin-right: 10px;">
                            <a-select-option v-for="(item, index) in selectList2" :key="index" :value="item.value">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                        <a-input-search v-model="searchForm.searchText" placeholder="客户代码、项目名称、项目地址" enter-button="搜索"
                            @search="getList" />
                    </div>
                </div>
            </div>
            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary">导出</a-button>
                    <a-button type="danger" style="margin-left: 10px;" @click="showDelModal">批量删除</a-button>
                </div>
                <a-table rowKey="id" :pagination="false" :data-source="dataSource" :columns="columns"
                    :loading="isloading" :row-selection="{ selectedRowKeys: selectedRowKeys }"
                    :scroll="{ x: 1400, y: 1300 }">
                    <template slot="operation" slot-scope="lineData">
                        <div class="flex j-ey a-c">
                            <a v-if="lineData.state == 0" @click="showExamineModal(lineData.id)">审核</a>
                            <a v-if="lineData.state == 1" @click="showDelayModal(lineData.id)">确认延期</a>
                            <a v-if="lineData.state == 2" @click="showRejectModal(lineData.id)">驳回原因</a>
                            <a>编辑</a>
                            <span>|</span>
                            <a style="color:red" @click="showDelModal(lineData.id)">删除</a>
                            <a @click="showSendModal(lineData.id)">查看模板消息</a>
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
        <a-modal v-model="delModal" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>

        <!--   延期    -->
        <a-modal v-model="delayModal" title="确认延期">
            <p>确认后报备单将顺延一个报备周期</p>
        </a-modal>

        <!--   驳回    -->
        <a-modal v-model="rejectModal" title="驳回原因">
            <p>工程重复了</p>
        </a-modal>

        <!--   审核    -->
        <a-modal v-model="examineModal" title="请审核">
            <div class="flex j-c a-c" style="margin-bottom: 20px">
                <a-radio-group v-model="value" name="radioGroup" style="width: 100%;">
                    <a-radio value="1">审核通过</a-radio>
                    <a-radio value="2">审核驳回</a-radio>
                </a-radio-group>
            </div>
            <div>
                <a-textarea placeholder="请输入100字以内驳回原因" allow-clear :autosize="{ minRows: 3 }" />
            </div>
        </a-modal>

        <!--   模板推送   -->
        <a-modal v-model="sendModal" title="模板消息推送状态">
            <a-table :columns="modelColumns" :data-source="modelMsgSend">
                <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
        </a-modal>

        <!-- 新增客户 -->
        <a-modal cancelText="取消" okText="保存" title="添加用户" v-model="addUser" width="45%">
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
                title: "报备单ID",
                width: "90px",
                dataIndex: "id",
            },
            {
                title: "客户代码",
                width: "90px",
                dataIndex: "customerCode",
                scopedSlots: { customRender: "customerCode" },
            },
            {
                title: "项目名称",
                dataIndex: "projectName",
                ellipsis: true,
                width: "100px",
                scopedSlots: { customRender: "projectName" },
            },
            {
                title: "项目地址",
                dataIndex: "address",
                scopedSlots: { customRender: "address" },
                width: 120,
            },
            {
                title: "用砖总量（片）",
                scopedSlots: { customRender: "nature" },
                dataIndex: "nature",
                width: 140,
            },
            {
                title: "项目几率",
                scopedSlots: { customRender: "successRate" },
                width: 120,
                dataIndex: "successRate",
            },
            {
                title: "报备时间",
                scopedSlots: { customRender: "datetimeReport" },
                width: 120,
                dataIndex: "datetimeReport",
            },
            {
                title: "用砖时间",
                scopedSlots: { customRender: "datetimeUse" },
                width: 120,
                dataIndex: "datetimeUse",
            },
            {
                title: "报备性质",
                dataIndex: "natureStr",
                width: "120px",
                ellipsis: true,
                scopedSlots: { customRender: "natureStr" },
            },
            {
                title: "报备状态",
                width: 180,
                dataIndex: "stateStr",
                scopedSlots: { customRender: "stateStr" },
            },
            {
                title: "操作",
                width: "330px",
                fixed: "right",
                scopedSlots: { customRender: "operation" },
            },
        ];
        columns = columns.map((item) => {
            return { ...item, align: "center" };
        });
        return {
            select1: "",
            select2: "",
            selectList1: [
                { value: "0", label: "全部" },
                { value: "1", label: "待审核" },
                { value: "2", label: "报备成功" },
            ],
            selectList2: [
                { value: "0", label: "全部" },
                { value: "1", label: "本区报备" },
                { value: "2", label: "跨区报备" }
            ],
            searchForm: {
                pageNo: 1,
                pageSize: 10,
                searchText: "",
                nature: "",
                state: ""
            },



            value1: "",

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
            delModal: false,
            delayModal: false,
            rejectModal: false,
            examineModal: false,
            sendModal: false,
            addUserList: {},
            modelMsgSend: [],
            modelColumns: [
                {
                    title: "消息类型",
                },
                {
                    title: "状态",
                }
            ],
        }
    },

    mounted() {
        this.getList();
    },

    methods: {
        async getList() {
            let res = await API.filingSheetList(this.searchForm.pageNo, this.searchForm.pageSize, this.searchForm.searchText, this.searchForm.nature, this.searchForm.state);
            this.dataSource = res.data.records
            this.totalCount = res.data.total
        },

        // 确认延期弹唱
        showDelayModal() {
            this.delayModal = true;
        },

        // 确认延期弹唱
        showSendModal() {
            this.sendModal = true;
        },

        //删除弹出
        showDelModal(id) {
            console.log(id);
            this.delModal = true;
        },

        // 驳回
        showRejectModal() {
            this.rejectModal = true;
        },
        // 审核
        showExamineModal() {
            this.examineModal = true;
        },





        // 分页改变
        changePage(page) {
            this.searchdata.num = page;
            this.getList();
        },
        // 分页的回调
        couponSizeChange(current, size) {
            this.searchdata.num = 1;
            this.searchdata.size = size;
            this.userList();
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
