<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">分销区域管理</div>
                </div>
            </div>
            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary" @click="showModel(2)">添加二级分销</a-button>
                    <!--                    <a-button type="danger" style="margin-left: 10px;" @click="showDelModal">批量删除</a-button>-->
                </div>
                <a-table rowKey="id" :pagination="false" :data-source="dataSource" :columns="columns"
                    :loading="isloading" :scroll="{ y: contentHeight - 369 }">

                    <template slot="operation" slot-scope="lineData">
                        <div class="flex j-ey a-c">
                            <a @click="showModelThree(3, lineData)">添加三级分销</a>
                            <a @click="showDelModal(lineData.id)" style="color:red">删除</a>
                        </div>
                    </template>
                </a-table>
                <div class="flex j-e a-c pagination-wrapper">
                    <span style="margin-right: 10px"> 合计{{ totalCount }}条 </span>
                    <a-pagination class="flex j-e pagination" v-model="pageNo" :total="totalCount" :locale="locale"
                        show-less-items @change="changePage" @showSizeChange="couponSizeChange" />
                </div>
            </div>
        </div>

        <!--   删除     -->
        <a-modal @ok="delSales" v-model="deleteOpen" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>

        <!-- 新增客户 -->
        <a-modal cancelText="取消" @ok="addSales" :title="cus == '2' ? '添加二级分销' : '添加三级分销'" v-model="addUser">
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 120px">分销区域名：</div>
                <a-input v-model="salesList.name" :maxLength="15" placeholder="输入15字以内的区域名"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 120px">分销代号：</div>
                <a-input v-model="salesList.code" :maxLength="10" placeholder="输入区域10以内的数字代号"></a-input>
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
                title: "分销区域名",
                dataIndex: "name",
                width: 200,
                scopedSlots: { customRender: "name" },
            },
            {
                title: "区域代号",
                dataIndex: "code",
                width: 200,
                scopedSlots: { customRender: "code" },
            },
            {
                title: "分销级别",
                dataIndex: "level",
                width: 200,
                scopedSlots: { customRender: "level" },
            },
            {
                title: "客户数",
                dataIndex: "customerNumber",
                width: 200,
                scopedSlots: { customRender: "customerNumber" },
            },
            {
                title: "操作",
                width: 200,
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
            salesList: {},
            cus: "",
            delid: ""
        }
    },
    mounted() {
        this.selectTreeInfo();
    },
    methods: {
        // 分页改变
        changePage(page) {
            this.pageNo = page;
            this.selectTreeInfo();
        },
        // 分页的回调
        couponSizeChange(current, size) {
            this.pageNo = 1;
            this.pageSize = size;
            this.selectTreeInfo();
        },




        //删除弹出
        showDelModal(id) {
            this.delid = id
            this.deleteOpen = true;
        },
        showModelThree(index, item) {
            this.cus = index
            this.parent = item.id
            this.addUser = true
        },
        showModel(index) {
            this.cus = index
            this.addUser = true
        },
        async selectTreeInfo() {
            let res = await API.selectTreeList(this.pageNo, this.pageSize);
            this.dataSource = res.data.records;
            this.totalCount = res.data.total
        },

        //删除
        async delSales() {
            let res = await API.delSalesArea({ id: this.delid })
            if (res.errorCode == 0) {
                this.$message.success("删除成功", 1);
                this.selectTreeInfo();
                this.deleteOpen = false;
            }
        },

        //添加
        async addSales() {
            this.salesList.level = this.cus
            if (this.cus == 3) {
                this.salesList.parentId = this.parent
            }
            let res = await API.addSalesArea(this.salesList);
            if (res.errorCode == 0) {
                this.$message.success("添加成功", 1);
                this.addUser = false;
                this.salesList = {}
                this.selectTreeInfo();
            } else {
                this.$message.error(res.msg);
            }
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
