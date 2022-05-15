<template>
    <div class="containter" style="overflow: hidden">

        <div class="content" ref="content">
            <div class="content-search">

                <div class="manageHeader">
                    <div class="titleContent">管理员管理</div>
                    <div class="headerSearch">
                        <a-input-search v-model="value" placeholder="用户名、手机号" enter-button="搜索" />
                    </div>
                </div>

            </div>

            <div class="content-header flex">
                <div class="header-right">
                    <a-button v-permission="'admin:setting:userList:add'" class="editable-add-btn"
                        style="margin-left: 10px" type="primary" @click="addUser = true">新建账号
                    </a-button>
                </div>
            </div>

            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary" @click="addUser = true">添加</a-button>
                    <a-button type="danger" style="margin-left: 10px;" @click="showDelModal">批量删除</a-button>
                </div>
                <a-table rowKey="id" :pagination="false" :data-source="dataSource" :columns="columns"
                    :loading="isloading" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :scroll="{ y: contentHeight - 369 }">
                    <template slot="name" slot-scope="text, record">
                        {{ record.key }}
                        <div class="overflow-one" style="max-width: 250px"></div>
                    </template>
                    <template slot="level" slot-scope="level">
                        {{ level == "super" ? '超级管理员' : level == "manager" ? '管理员' : '其他' }}
                    </template>
                    <template slot="operation" slot-scope="lineData">
                        <div class="flex j-ey a-c">
                            <a @click="reRetUseInfo(lineData)">编辑</a>
                            <a style="color:red" @click="showDelModal(lineData.id)">删除</a>
                        </div>
                    </template>
                </a-table>
                <div class="flex j-e a-c pagination-wrapper">
                    <span style="margin-right: 10px"> 合计{{ totalCount }}条 </span>
                    <a-pagination class="flex j-e pagination" @change="changePage" :current="pageNo" :total="totalCount"
                        :locale="locale" show-size-changer />
                </div>
            </div>
        </div>

        <a-modal cancelText="取消" title="修改信息" v-model="showUserInfo">
            <!-- :confirm-loading="confirmLoading" -->
            <div class="flex j-c a-c" style="margin-bottom: 20px">
                <div style="width: 100px">姓名：</div>
                <a-input v-model="userInfo.userName" placeholder="请输入姓名"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">手机号：</div>
                <a-input v-model="userInfo.phone" placeholder="请输入手机号"></a-input>
            </div>
        </a-modal>
        <!-- 新增账户 -->
        <a-modal v-model="addUser" @ok="addAccount" cancelText="取消" okText="保存" title="添加用户">
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">手机号：</div>
                <a-input v-model="addUserList.phone" placeholder="请输入手机号"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">用户名：</div>
                <a-input v-model="addUserList.userAccount" placeholder="请输入姓名"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">密码：</div>
                <a-input type="password" v-model="addUserList.pwdMd5" placeholder="请输入密码"></a-input>
            </div>
            <span style="margin-top: 5px;font-size:12px;margin-left: 80px;">管理员登录后台得密码，请填写6-20位英文或数字</span>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">角色：</div>
                <a-radio-group v-model="addUserList.level" name="radioGroup" style="width: 100%;">
                    <a-radio value="super">超级管理员</a-radio>
                    <a-radio value="manager">管理员</a-radio>
                </a-radio-group>
            </div>
        </a-modal>

        <!--   删除     -->
        <a-modal @ok="delAccount" v-model="deleteOpen" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>
    </div>
</template>
<script>
import API from "../../../service/user";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";

export default {
    name: "accountList",
    data() {
        let columns = [
            // {
            //     title: "序号",
            //     width: "90px",
            //     customRender: (a, b, i) => {
            //         const count = this.dataSource.length * 1;
            //         return count - i;
            //     },
            // },
            {
                title: "管理员ID",
                width: "90px",
                dataIndex: "id",
            },
            {
                title: "用户名",
                dataIndex: "userAccount",
                ellipsis: true,
                width: "100px",
                scopedSlots: { customRender: "userAccount" },
            },
            {
                title: "手机号码",
                dataIndex: "phone",
                scopedSlots: { customRender: "phone" },
                width: 120,
            },
            {
                title: "用户角色",
                dataIndex: "level",
                width: "250px",
                ellipsis: true,
                scopedSlots: { customRender: "level" },
            },
            {
                title: "上次登录时间",
                width: 180,
                dataIndex: "datetimeCreated",
                scopedSlots: { customRender: "datetimeCreated" },
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
            value: "",
            addUser: false,
            isloading: false, //tablede
            searchLoading: false, //查询的
            locale: zhCN, //中文
            tabledata: {}, // table数据
            comeIntoBlue: false, //状态点是否亮
            typeId: 0,
            totalCount: 1, //数据总条数

            dataSource: [],
            count: 2,
            columns: columns,

            // 穿梭器Start
            showTransfer: false,
            mockData: [],
            mockDataCopy: [],
            mockDataCopyID: [],
            targetKeys: [],
            modelType: "",
            useId: "", //用户id
            // 穿梭器end
            // 修改name Start
            showUserInfo: false,
            userInfo: {
                userName: "",
                phone: "",
            },
            addUserList: {},
            roleListData: [],
            contentHeight: 0,
            // 修改name end


            // new
            selectedRowKeys: [],
            deleteOpen: false,
            pageNo: 1,
            pageSize: 10,
            ids: ""
        };
    },
    mounted() {
        this.userList();
    },

    methods: {
        //删除弹出
        showDelModal(id) {
            this.ids = []
            this.deleteOpen = true;
            this.ids = id
        },


        async userList() {
            let res = await API.getUserList(this.pageNo, this.pageSize);
            this.dataSource = res.data.records;
            this.totalCount = res.data.total
        },

        async addAccount() {
            let res = await API.addUser(this.addUserList);
            if (res.errorCode == 0) {
                this.addUser = false
                this.addUserList = {}
                this.userList();
            }
        },

        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },

        // 分页改变
        changePage(page) {
            this.pageNo = page;
            this.userList();
        },
        // 分页的回调
        couponSizeChange(current, size) {
            this.pageNo = 1;
            this.pageSize = size;
            this.userList();
        },

        async delAccount(id) {
            let res = await API.addUser({ ids: this.ids });
            if (res.errorCode == 0) {
                this.deleteOpen = false
            }
        },


    },

};
</script>
<style lang="scss" scoped>
.containter {
    .content-search {
        .search-right {
            position: absolute;
            right: 20px;
            bottom: 20px;

            .reset {
                margin-left: 10px;
            }
        }
    }

    .content {
        position: relative;

        .comeInto {
            display: inline-block;
            margin: 0px 5px 2px 0px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: rgb(126, 120, 120);
        }

        .pagination-wrapper {
            margin-top: 10px;
            padding-bottom: 10px;

            .pagination {
                margin-right: 11px;
            }
        }

        ::v-deep.ant-transfer {

            /* background: #abf; */
            .ant-btn-icon-only {
                border-radius: 50%;
            }

            .ant-transfer-list-header {
                background: #f5f7fa;
            }
        }

        ::v-deep.noRight {
            .ant-transfer-operation {
                display: none;
            }

            .ant-transfer-list:last-child {
                display: none;
            }
        }
    }
}

.opacity {
    opacity: 0.4;
}

.search-input-left {
    width: 400px;
    display: inline-block;
}

.content {
    .content-header {
        position: relative;
        width: 100%;
        background-color: #fff;
        padding: 20px 20px 0 20px;

        h3 {
            font-weight: bolder;
            display: inline-block;
            position: relative;
        }

        .header-right {
            display: inline-block;

            /* position: absolute; */
            /* right: 0px; */
            .export {
                margin-left: 25px;
                margin-right: 22px;
                display: none;
            }
        }
    }

    ::v-deep.ant-table-row:nth-of-type(2n-1) {
        background-color: #fafafa;
    }
}

.search-content {
    .search-input-right {
        .ant-select-selection {
            width: px;
        }
    }
}

.middle {
    height: 15px;
}

.search-input-right {
    width: 600px;
    display: inline-block;
    padding-left: 80px;
}

.search-span-left {
    margin-right: 15px;
}

.page-header {
    background: #fff;
    box-shadow: 0 0 3px 1px #eee;
}

/* 新加 */
.manageHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.manageAll {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
}
</style>
