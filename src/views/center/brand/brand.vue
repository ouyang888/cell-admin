<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">品牌管理</div>
                </div>
            </div>
            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary" @click="adduserModel(0)">添加</a-button>
                    <a-button type="danger" style="margin-left: 10px;" @click="showDelModal">批量删除</a-button>
                </div>
                <a-table rowKey="id" :pagination="false" :data-source="dataSource" :columns="columns"
                    :loading="isloading" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :scroll="{ y: contentHeight - 369 }">
                    <template slot="state" slot-scope="state">
                        {{ state == 'A' ? '已启用' : '已禁用' }}
                    </template>
                    <template slot="operation" slot-scope="text,scope">
                        <div class="flex j-ey a-c">
                            <a @click="changeState(scope)">{{ scope.state == "A" ? '禁用' : '启用' }}</a>
                            <a @click="editUser(scope, 1)">编辑</a>
                            <a style="color:red" @click="showDelModal(scope.id)">删除</a>
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
        <a-modal @ok="delDrandInfo" v-model="deleteOpen" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>

        <!-- 新增客户 -->
        <a-modal cancelText="取消" @ok="saveBrand" okText="保存" :title="items == 1 ? '修改品牌' : '添加品牌'" v-model="addUser">
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">品牌名称：</div>
                <a-input v-model="addUserList.name" placeholder="请输入"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">品牌代号：</div>
                <a-input v-model="addUserList.code" placeholder="请输入"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">状态：</div>
                <a-radio-group v-model="addUserList.state" name="radioGroup" style="width: 100%;">
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
export default {
    data() {
        let columns = [
            {
                title: "品牌ID",
                dataIndex: "id",
            },
            {
                title: "品牌名",
                dataIndex: "name",
                scopedSlots: { customRender: "name" },
            },
            {
                title: "品牌代号",
                dataIndex: "code",
                scopedSlots: { customRender: "code" },
            },
            {
                title: "状态",
                dataIndex: "state",
                scopedSlots: { customRender: "state" },
            },
            {
                title: "操作",
                width: "180px",
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
            fileList: [],
            pageNo: 1,
            pageSize: 10,
            ids: [],
            items: 0,
        }
    },

    mounted() {
        this.brandInfo();
    },


    methods: {
        // 分页改变
        changePage(page) {
            this.pageNo = page;
            this.brandInfo();
        },
        // 分页的回调
        couponSizeChange(current, size) {
            this.pageNo = 1;
            this.pageSize = size;
            this.brandInfo();
        },
        //删除弹出
        showDelModal(id) {
            this.ids = []
            this.deleteOpen = true;
            this.ids.push(id)
        },

        async brandInfo() {
            let res = await API.brandList(this.pageNo, this.pageSize);
            this.dataSource = res.data.records;
            this.totalCount = res.data.total
        },
        //新增
        async addBrandInfo() {
            let res = await API.addBrand(this.addUserList);
            if (res.errorCode == 0) {
                this.$message.success("添加成功", 1);
                this.addUserList = {}
                this.addUser = false;
                this.brandInfo();
            } else {
                this.$message.error(res.msg);
                this.addUser = false;
            }
        },


        saveBrand() {
            if (this.items == 0) {
                this.addBrandInfo();
            } else {
                this.editBrand();
            }
        },

        //修改用户信息
        async editUser(item, index) {
            this.addUser = true;
            this.addUserList = item
            this.items = index
            // console.log("itemwww22",item)
        },

        adduserModel(index) {
            this.items = index
            this.addUserList = {}
            this.addUser = true
        },


        //修改
        async editBrand() {
            let res = await API.updateDrand(this.addUserList);
            if (res.errorCode == 0) {
                this.addUser = false
                this.addUserList = {}
                this.userList();
            } else {
                this.$message.error(res.msg, 1);
            }
        },


        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        //删除
        async delDrandInfo() {
            let res = await API.delDrand(this.selectedRowKeys.length != 0 ? this.selectedRowKeys : this.ids);
            if (res.errorCode == 0) {
                this.$message.success("删除成功", 0.5);
                this.selectedRowKeys = [];
                this.ids = [];
                this.brandInfo();
                this.deleteOpen = false;
            } else {
                this.$message.error(res.msg, 1);
            }
        },

        //点击可用禁用
        async changeState(item) {
            let code = ""
            if (item.state == "D") {
                code = "A"
            } else if (item.state == "A") {
                code = "D"
            }
            let list = {
                id: item.id,
                name: item.name,
                state: code,
                code: item.code
            }
            let res = await API.updateDrand(list);
            if (res.errorCode == 0) {
                this.$message.success("修改成功", 0.5);
                this.brandInfo();
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
