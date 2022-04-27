<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">样品列表</div>
                    <div class="headerSearch">
                        <a-input-search
                            v-model="value"
                            placeholder="样品名"
                            enter-button="搜索"
                        />
                    </div>
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
                            <a v-permission="'admin:setting:userList:update'">下架</a>
                            <a v-permission="'admin:setting:userList:update'">编辑</a>
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
            title="添加样品"
            v-model="addUser"
            width="45%"
        >
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品名称：</div>
                <a-input
                    v-model="addUserList.userName"
                    placeholder="请输入"
                ></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品型号：</div>
                <a-input
                    v-model="addUserList.userName"
                    placeholder="请输入"
                ></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品系列：</div>
                <a-input
                    v-model="addUserList.userName"
                    placeholder="请输入"
                ></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品工艺：</div>
                <a-input
                    v-model="addUserList.userName"
                    placeholder="请输入"
                ></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品排序：</div>
                <a-input
                    v-model="addUserList.userName"
                    placeholder="请输入"
                ></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品规格：</div>
                <a-input
                    v-model="addUserList.userName"
                    placeholder="请输入"
                ></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品面积：</div>
                <a-input
                    v-model="addUserList.password"
                    placeholder="13.3"
                    addon-after="平方米"
                ></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品标价：</div>
                <a-input
                    v-model="addUserList.password"
                    placeholder="13.3"
                    addon-after="元/片"
                ></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">品牌名称：</div>
                <a-select
                    ref="select"
                    v-model="value1"
                    style="width: 100%;margin-right: 10px;"
                >
                    <a-select-option value="jack">全部</a-select-option>
                </a-select>
            </div>
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">样品分类：</div>
                <a-select
                    ref="select"
                    v-model="value1"
                    style="width: 100%;margin-right: 10px;"
                >
                    <a-select-option value="jack">全部</a-select-option>
                </a-select>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">状态：</div>
                <a-radio-group v-model="value" name="radioGroup" style="width: 100%;">
                    <a-radio value="1">上架</a-radio>
                    <a-radio value="2">下架</a-radio>
                </a-radio-group>
            </div>

            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">轮播图片：</div>
                <div style="width: 100%">
                    <a-upload
                        v-model="fileList"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        list-type="picture-card"
                    >
                        <div v-if="fileList.length < 8">
                            <a-icon type="plus" />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                    <p>可以上传5张图片，分辨率3000px以下，大小不得超过10M</p>
                </div>
            </div>

            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">缩略图：</div>
                <div style="width: 100%">
                    <a-upload
                        v-model="fileList"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        list-type="picture-card"
                    >
                        <div v-if="fileList.length < 8">
                            <a-icon type="plus" />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                    <p>上传1张长宽比例为1:1的图片，用于小程序样品列表页展示</p>
                </div>
            </div>

            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">详情图片：</div>
                <div style="width: 100%">
                    <a-upload
                        v-model="fileList"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        list-type="picture-card"
                    >
                        <div v-if="fileList.length < 8">
                            <a-icon type="plus" />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                    <p>可以上传多张图片，分辨率3000px以下，大小不得超过10M</p>
                </div>
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
                title: "样品ID",
                width: "90px",
                dataIndex: "account",
            },
            {
                title: "样品名",
                dataIndex: "userName",
                ellipsis: true,
                width: "100px",
                scopedSlots: {customRender: "userName"},
            },
            {
                title: "型号",
                dataIndex: "phone",
                scopedSlots: {customRender: "phone"},
                width: 120,
            },
            {
                title: "系列",
                scopedSlots: {customRender: "phone"},
                width: 120,
            },
            {
                title: "工艺",
                scopedSlots: {customRender: "phone"},
                width: 120,
            },
            {
                title: "品牌",
                scopedSlots: {customRender: "phone"},
                width: 120,
            },
            {
                title: "分类",
                scopedSlots: {customRender: "phone"},
                width: 120,
            },
            {
                title: "状态",
                width: 180,
                dataIndex: "createTime",
                scopedSlots: {customRender: "createTime"},
            },
            {
                title: "排序",
                dataIndex: "role",
                width: "120px",
                ellipsis: true,
                scopedSlots: {customRender: "role"},
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
