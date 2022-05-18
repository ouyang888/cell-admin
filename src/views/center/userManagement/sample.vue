<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">样品清单</div>
                    <div class="headerSearch">
                        <a-input-search v-model="value" placeholder="样品名" enter-button="搜索" />
                    </div>
                </div>
            </div>
            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary" @click="addUserModel">添加</a-button>
                    <a-button type="danger" style="margin-left: 10px;" @click="showDelModal">批量删除</a-button>
                </div>
                <a-table rowKey="id" :pagination="false" :data-source="dataSource" :columns="columns"
                    :loading="isloading" :row-selection="{ selectedRowKeys: selectedRowKeys }"
                    :scroll="{ y: contentHeight - 369 }">
                    <template slot="name" slot-scope="text, record">
                        {{ record.key }}
                        <div class="overflow-one" style="max-width: 250px"></div>
                    </template>
                    <template slot="userName" style="min-width: 100px" slot-scope="userName">
                        {{ userName }}
                    </template>
                    <template slot="phone" slot-scope="phone">
                        {{ phone }}
                    </template>
                    <template slot="role" slot-scope="role">
                        {{ role }}
                    </template>
                    <template slot="operation">
                        <div class="flex j-ey a-c">
                            <a v-permission="'admin:setting:userList:disable'">删除</a>
                        </div>
                    </template>
                    <!--                    <template slot="enabled" slot-scope="text">-->
                    <!--                        <div :style="{ color: text == 0 ? 'red' : '' }">-->
                    <!--                            {{ text == 0 ? "禁用" : "正常" }}-->
                    <!--                        </div>-->
                    <!--                    </template>-->
                </a-table>
                <div class="flex j-e a-c pagination-wrapper">
                    <span style="margin-right: 10px"> 合计{{ totalCount }}条 </span>
                    <a-pagination class="flex j-e pagination" v-model="pageNo" :total="totalCount" :locale="locale"
                        show-less-items @change="changePage" @showSizeChange="couponSizeChange" />
                </div>
            </div>
        </div>

        <!--   删除     -->
        <a-modal v-model="deleteOpen" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>

        <a-modal cancelText="取消" okText="保存" title="添加样品" :footer="null" width="40%" v-model="addUser">
            <div class="headerSearch" style="display: flex;margin-bottom: 20px">
                <a-input-search v-model="searchValueSample" placeholder="样品名" @search="sampleInfo" enter-button="搜索" />
                <a-button @click="addSampleRelation" type="primary" style="margin-left: 15px;">确定添加</a-button>
            </div>
            <a-table rowKey="id" :dataSource="addDataSource" :columns="addCouml"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChangeSample }" />

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
                title: "样品名",
                dataIndex: "userName",
                ellipsis: true,
                width: "100px",
                scopedSlots: { customRender: "userName" },
            },
            {
                title: "型号",
                dataIndex: "phone",
                scopedSlots: { customRender: "phone" },
                width: 120,
            },
            {
                title: "系列",
                scopedSlots: { customRender: "phone" },
                width: 120,
            },
            {
                title: "工艺",
                scopedSlots: { customRender: "phone" },
                width: 120,
            },
            {
                title: "品牌",
                scopedSlots: { customRender: "phone" },
                width: 120,
            },
            {
                title: "分类",
                scopedSlots: { customRender: "phone" },
                width: 120,
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
            addDataSource: [],
            count: 2,
            columns: columns,
            // new
            selectedRowKeys: [],
            deleteOpen: false,
            addUserList: {},
            addCouml: [
                {
                    title: "样品名",
                    dataIndex: "name",
                    scopedSlots: { customRender: "name" },
                    width: 120,
                },
                {
                    title: "型号",
                    dataIndex: "model",
                    scopedSlots: { customRender: "model" },
                    width: 120,
                },
                {
                    title: "系列",
                    dataIndex: "series",
                    scopedSlots: { customRender: "series" },
                    width: 120,
                },
                {
                    title: "品牌",
                    dataIndex: "brand",
                    scopedSlots: { customRender: "brand" },
                    width: 120,
                },
            ],
            pageNo: 1,
            pageSize: 10,
            searchValueSample: "",
            addtotalCount: 1,
        }
    },

    methods: {
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
        //删除弹出
        showDelModal() {
            this.deleteOpen = true;
        },

        //点击样品列表添加
        addUserModel() {
            this.addUser = true;
            this.sampleInfo();
        },

        onSelectChangeSample(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },

        //样品列表
        async sampleInfo() {
            let res = await API.sampleList(this.pageNo, this.pageSize, this.searchValueSample);
            this.addDataSource = res.data.records;
            this.addtotalCount = res.data.total
        },

        //新增客户样品
        async addSampleRelation() {
            if (this.selectedRowKeys.length <= 0) {
                this.$message.warning("请选择要删除条目", 1);
                return;
            }
            let res = await API.sampleRelation({sampleIds:this.selectedRowKeys})
            if (res.errorCode == 0) {
                this.$message.success("添加成功", 0.5);
                this.addUser = false;
                this.samplelList();
            }
        },

        //客户样品列表
        async samplelList() {
            let id = this.$route.query.id
            let res = await API.selectCustomerSamplelList(this.pageNo, this.pageSize, id);
            this.dataSource = res.data.records;
            this.totalCount = res.data.total
        },

    },
    mounted() {
        this.samplelList();
    },
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
