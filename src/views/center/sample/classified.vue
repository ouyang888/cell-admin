<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">样品分类</div>
<!--                    <div class="headerSearch">-->
<!--                        <a-input-search-->
<!--                            v-model="value"-->
<!--                            placeholder="样品名"-->
<!--                            enter-button="搜索"-->
<!--                        />-->
<!--                    </div>-->
                </div>
            </div>
            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary" @click="addUser = true">添加</a-button>
                    <a-button type="danger" style="margin-left: 10px;" @click="showDelModal">批量删除</a-button>
                </div>
                <a-table
                    rowKey="id"
                    :pagination="false"
                    :data-source="dataSource"
                    :columns="columns"
                    :loading="isloading"
                    :row-selection="{ selectedRowKeys: selectedRowKeys }"
                    :scroll="{ y: contentHeight - 369 }"
                >
                    <template slot="name" slot-scope="text, record">
                        {{ record.key }}
                        <div class="overflow-one" style="max-width: 250px"></div>
                    </template>
                    <template
                        slot="userName"
                        style="min-width: 100px"
                        slot-scope="userName"
                    >
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
                            <a v-permission="'admin:setting:userList:update'">禁用</a>
                            <a v-permission="'admin:setting:userList:update'">编辑</a>
                            <a v-permission="'admin:setting:userList:disable'">删除</a>
                        </div>
                    </template>
                </a-table>
                <div class="flex j-e a-c pagination-wrapper">
                    <span style="margin-right: 10px"> 合计{{ totalCount }}条 </span>
                    <a-pagination
                        class="flex j-e pagination"
                        :current="searchdata.num"
                        :total="totalCount"
                        :locale="locale"
                        show-size-changer
                        @change="changePage"
                        @showSizeChange="couponSizeChange"
                    />
                </div>
            </div>
        </div>

        <!--   删除     -->
        <a-modal v-model="deleteOpen" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>

        <!-- 新增客户 -->
        <a-modal
            cancelText="取消"
            okText="保存"
            title="添加分类"
            v-model="addUser"
        >
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">分类名称：</div>
                <a-input
                    v-model="addUserList.userName"
                    placeholder="请输入"
                ></a-input>
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
export default {
    data() {
        let columns = [
            {
                title: "分类ID",
                width: "90px",
                dataIndex: "account",
            },
            {
                title: "分类名",
                dataIndex: "userName",
                ellipsis: true,
                width: "100px",
                scopedSlots: {customRender: "userName"},
            },
            {
                title: "状态",
                width: 180,
                dataIndex: "createTime",
                scopedSlots: {customRender: "createTime"},
            },
            {
                title: "操作",
                width: "190px",
                fixed: "right",
                scopedSlots: {customRender: "operation"},
            },
        ];
        columns = columns.map((item) => {
            return {...item, align: "center"};
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
            addUserList:{},
            fileList: [],
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
        showDelModal(){
            this.deleteOpen = true;
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

.headerSearch{
    display: flex;
}

.manageAll{
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
