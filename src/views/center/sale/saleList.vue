<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">销售单列表</div>
                    <div class="headerSearch">
                        <a-select :allowClear="true" ref="select" v-model="searchForm.state" style="width: 160px;margin-right: 10px;">
                            <a-select-option v-for="(item,index) in selectList1" :key="index" :value="item.value">
                                {{item.label}}
                            </a-select-option>
                        </a-select>
                        <a-select ref="select" v-model="searchForm.nature" style="width: 160px;margin-right: 10px;">
                            <a-select-option v-for="(item,index) in selectList2" :key="index" :value="item.value">
                                {{item.label}}
                            </a-select-option>
                        </a-select>
                        <a-input-search v-model="searchForm.searchText" @search="salesInfo" placeholder="客户代码" enter-button="搜索"/>
                    </div>
                </div>
            </div>
            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary">导出</a-button>
                    <a-button type="danger" style="margin-left: 10px;" @click="delMoreHandle">批量删除</a-button>
                </div>

                <a-table rowKey="id"
                         :pagination="false"
                         :data-source="dataSource"
                         :columns="columns"
                         :loading="isloading" :row-selection="{ selectedRowKeys: selectedRowKeys , onChange: onSelectChange}"
                         class="table-list"
                         >

                    <template slot="operation" slot-scope="progress,lineData">
                        <div class="flex j-ey a-c">
                            <a v-if="lineData.state == 0" @click="showModal(lineData.id,'examineModal')">审核</a>
                            <a v-if="lineData.state == 2" @click="showModal(lineData.id,'rejectModal')">驳回原因</a>
                            <a @click="goEdit(lineData)">编辑</a>
                            <span>|</span>
                            <a @click="showModal(lineData.id,'delModal')" style="color:red">删除</a>
                            <a @click="showModal(lineData.id,'sendModal')">查看模板消息</a>
                        </div>
                    </template>
                </a-table>
                <div class="flex j-e a-c pagination-wrapper">
                    <span style="margin-right: 10px"> 合计{{ totalCount }}条 </span>
                    <a-pagination class="flex j-e pagination" :current="searchdata.num" :total="totalCount"
                                  :locale="locale" show-size-changer @change="changePage" @showSizeChange="couponSizeChange"/>
                </div>
            </div>
        </div>

        <!--   删除     -->
        <a-modal v-model="delModal" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>

        <!--   驳回    -->
        <a-modal v-model="rejectModal" title="驳回原因">
            <p>工程重复了</p>
        </a-modal>

        <!--   审核    -->
        <a-modal v-model="examineModal" @ok="examineHandle" title="请审核">
            <div class="flex j-c a-c" style="margin-bottom: 20px">
                <a-radio-group v-model="examineForm.state" name="radioGroup" style="width: 100%;">
                    <a-radio value="1">审核通过</a-radio>
                    <a-radio value="2">审核驳回</a-radio>
                </a-radio-group>
            </div>
            <div>
                <a-textarea v-model="examineForm.reason" placeholder="请输入100字以内驳回原因" allow-clear :autosize="{ minRows: 3 }"/>
            </div>
        </a-modal>

        <!--   模板推送   -->
        <a-modal v-model="sendModal" title="模板消息推送状态">
            <a-table :columns="modelColumns" :data-source="modelMsgSend">
                <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
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
                    title: "销售单ID",
                    width: "90px",
                    dataIndex: "id",
                },
                {
                    title: "客户代码",
                    dataIndex: "customerCode",
                    ellipsis: true,
                    width: "100px",
                    scopedSlots: {customRender: "customerCode"},
                },
                {
                    title: "客户名",
                    dataIndex: "customerName",
                    ellipsis: true,
                    width: "100px",
                    scopedSlots: {customRender: "customerName"},
                },
                {
                    title: "业主姓名",
                    dataIndex: "ownerName",
                    scopedSlots: {customRender: "ownerName"},
                    width: 120,
                },
                {
                    title: "业主电话",
                    dataIndex: "ownerPhone",
                    scopedSlots: {customRender: "ownerPhone"},
                    width: 120,
                },
                {
                    title: "销售渠道",
                    dataIndex: "salesChannelName",
                    scopedSlots: {customRender: "salesChannelName"},
                    width: 120,
                },
                {
                    title: "用砖地址",
                    dataIndex: "address",
                    scopedSlots: {customRender: "address"},
                    width: 120,
                },
                {
                    title: "订单日期",
                    dataIndex: "datetimeOrder",
                    scopedSlots: {customRender: "datetimeOrder"},
                    width: 120,
                },
                {
                    title: "送货日期",
                    width: 180,
                    dataIndex: "datetimeDelivery",
                    scopedSlots: {customRender: "datetimeDelivery"},
                },
                {
                    title: "录单时间",
                    width: 180,
                    dataIndex: "datetimeCreated",
                    scopedSlots: {customRender: "datetimeCreated"},
                },
                {
                    title: "销售性质",
                    width: 180,
                    dataIndex: "natureStr",
                    scopedSlots: {customRender: "natureStr"},
                },
                {
                    title: "销售单状态",
                    dataIndex: "stateStr",
                    width: "120px",
                    scopedSlots: {customRender: "stateStr"},
                },
                {
                    title: "操作",
                    width: "300px",
                    dataIndex: "operation",
                    scopedSlots: {customRender: "operation"},
                },
            ];
            columns = columns.map((item) => {
                return {...item, align: "center"};
            });
            return {
                id:null,
                select1: "",
                select2: "",
                selectList1:[
                    {value:"0",label:"全部"},
                    {value:"1",label:"待审核"},
                    {value:"2",label:"审核成功"},
                    {value:"3",label:"审核驳回"},
                ],
                selectList2:[
                    {value:"0",label:"全部"},
                    {value:"1",label:"本区销售"},
                    {value:"2",label:"跨区销售"}
                ],

                searchForm:{
                    pageNo:1,
                    pageSize:10,
                    searchText: "",
                    nature:"",
                    state:""
                },
                examineForm:{},
                examineModal: false,
                delModal: false,
                rejectModal: false,
                sendModal: false,
                isDelMore:false,
                totalCount: 0,
                locale: zhCN, //中文
                state:"",
                nature:"",
                searchdata: {},
                isloading: false,
                columns: columns,
                dataSource: [],
                selectedRowKeys: [],

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
            this.salesInfo();
        },

        methods: {
            // 弹窗
            showModal(id,modal) {
                this[modal] = true;
                this.id = id;
            },

            // 确认审核
            async examineHandle(){
                this.examineForm.id = this.id
                await API.salesUpdate(this.examineForm)
                this.salesInfo();
                this.examineModal = false;
            },
            // 选择报备单
            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys;
            },

            // 批量删除校检
            delMoreHandle(){
                if (this.selectedRowKeys.length <= 0) {
                    this.$message.warning("请选择要删除报备单", 1);
                    return
                }
                this.isDelMore = true;
                this.delModal = true;
            },

            // 确认删除
            async delHandle(){
                let res =  await API.salesDelete(this.isDelMore ? this.selectedRowKeys : [this.id])
                if (res.errorCode == 0) {
                    this.$message.success("删除成功", 1);
                    this.selectedRowKeys = [];
                    this.getList();
                    this.delModal = false
                }
            },

            // 编辑
            goEdit(data){
                let {id,reportType} = {...data}
                this.$router.push({ path: "/center/editSale", query: {id,reportType} });
            },


            // 获取列表数据
            async salesInfo() {
                let res = await API.salesList(this.searchForm.pageNo, this.searchForm.pageSize, this.searchForm.searchText,this.searchForm.nature,this.searchForm.state);
                this.dataSource = res.data.records;
                this.totalCount = res.data.total
            },
            // 分页改变
            changePage(page) {
                this.searchdata.num = page;
                this.getSysUserList();
            },
            // 分页的回调
            couponSizeChange(current, size) {
                this.searchdata.num = 1;
                this.searchdata.size = size;
                this.getSysUserList();
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
    .table-list{
        overflow-x: auto;
    }
</style>
