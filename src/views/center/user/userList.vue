<template>
  <div class="containter containter-have-title" style="overflow: hidden">
    <page-header
      :breadcrumb="['设置', '账号列表']"
      title="账号列表"
    ></page-header>
    <div class="content" ref="content">
      <div class="content-search">
        <a-row :gutter="[50, 10]">
          <a-col :span="8" class="flex j-ey a-c">
            <span style="width: 100px">登录账号：</span>
            <a-input
              placeholder="请输入"
              v-model="searchdata.account"
              @keyup.enter="searchSysUserList"
            />
          </a-col>
          <a-col :span="8" class="flex j-ey a-c">
            <span style="width: 100px">姓名：</span>
            <a-input
              placeholder="请输入"
              v-model="searchdata.name"
              @keyup.enter="searchSysUserList"
            />
          </a-col>
          <a-col :span="8">
            <a-button
              type="primary"
              style="margin-right: 10px"
              @click="searchSysUserList(true)"
              :loading="searchLoading"
            >
              查询
            </a-button>
            <a-button class="reset" @click="reset"> 重置 </a-button>
          </a-col>
          <a-col :span="8" class="flex j-ey a-c">
            <span style="width: 100px">手机号：</span>
            <a-input
              placeholder="请输入"
              v-model="searchdata.phone"
              @keyup.enter="searchSysUserList"
            />
          </a-col>
          <a-col :span="8" class="flex j-ey a-c">
            <span style="width: 100px">状态：</span>
            <a-select
              :allowClear="true"
              mode="multiple"
              placeholder="请输入"
              v-model="searchdata.status"
              style="width: 100%"
            >
              <a-select-option key="1"> 正常 </a-select-option>
              <a-select-option key="0"> 禁用 </a-select-option>
            </a-select>
          </a-col>
        </a-row>
      
      </div>


      <div class="content-details">
        <a-table
          rowKey="id"
          :pagination="false"
          :data-source="dataSource"
          :columns="columns"
          :loading="isloading"
          :scroll="{ y: contentHeight - 369 }"
        >
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
    <a-modal
      cancelText="取消"
      destroyOnClose
      :getContainer="mountModal"
      class="transfer-modal-wrapper"
      v-model="showTransfer"
      centered
      :width="modelType == '授权' ? '600px' : '300px'"
      :title="modelType == '授权' ? '账号授权' : '权限复制'"
      @ok="transferOk"
      :afterClose="afterClose"
    >
      <div v-if="modelType == '授权'">
        <a-select
          default-value="角色权限"
          style="width: 240px; margin-bottom: 20px"
          @change="changeRole"
        >
          <a-select-option value="0">角色权限</a-select-option>
          <a-select-option value="1">网点权限</a-select-option>
        </a-select>
      </div>
      <!-- 穿梭器start -->
      <a-transfer
        :titles="['可选角色', '已选角色']"
        :rowKey="(record) => record.id.toString()"
        :data-source="modelType == '权限复制' ? mockDataCopy : mockData"
        show-search
        :list-style="{
          width: '250px',
          height: '300px',
        }"
        :target-keys="targetKeys"
        :render="
          (item) => `${modelType == '权限复制' ? item.userName : item.name}`
        "
        @change="transferHandleChange"
        @selectChange="transferSelectChange"
        :class="{ noRight: modelType == '权限复制' }"
      >
        <span slot="notFoundContent"> 无数据 </span>
      </a-transfer>
      <!-- 穿梭器end -->
    </a-modal>
    <a-modal
      cancelText="取消"
      title="修改信息"
      v-model="showUserInfo"
      @ok="handleOk"
      @afterClose="showUserInfoAfterClose"
    >
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

    <a-modal
      cancelText="取消"
      title="创建账户"
      v-model="addUser"
      @ok="addUserOk"
    >
      <div class="flex j-c a-c" style="margin-bottom: 20px">
        <div style="width: 100px">姓名：</div>
        <a-input
          v-model="addUserList.userName"
          placeholder="请输入姓名"
        ></a-input>
      </div>
      <div class="flex j-c a-c" style="margin-top: 10px">
        <div style="width: 100px">手机号：</div>
        <a-input
          v-model="addUserList.phone"
          placeholder="请输入手机号"
        ></a-input>
      </div>
      <div class="flex j-c a-c" style="margin-top: 20px">
        <div style="width: 100px">密码：</div>
        <a-input
          v-model="addUserList.password"
          placeholder="请输入密码"
        ></a-input>
      </div>
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
      {
        title: "序号",
        width: "90px",
        customRender: (a, b, i) => {
          const count = this.dataSource.length * 1;
          return count - i;
        },
      },
      {
        title: "登录账户",
        width: "90px",
        dataIndex: "account",
        width: 120,
      },
      {
        title: "姓名",
        dataIndex: "userName",
        ellipsis: true,
        width: "100px",
        scopedSlots: { customRender: "userName" },
      },
      {
        title: "手机号",
        dataIndex: "phone",
        scopedSlots: { customRender: "phone" },
        width: 120,
      },
      {
        title: "角色",
        dataIndex: "role",
        width: "250px",
        ellipsis: true,
        scopedSlots: { customRender: "role" },
      },
      {
        title: "创建时间",
        width: 180,
        dataIndex: "createTime",
        scopedSlots: { customRender: "createTime" },
      },
      {
        title: "状态",
        width: "90px",
        dataIndex: "enabled",
        scopedSlots: { customRender: "enabled" },
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
      addUser: false,
      isloading: false, //tablede
      searchLoading: false, //查询的
      locale: zhCN, //中文
      tabledata: {}, // table数据
      comeIntoBlue: false, //状态点是否亮
      typeId: 0,
      searchdata: {
        account: "", // 账号
        name: "",
        phone: "",
        num: 1,
        size: 10,
        status: [], // 0：不可用  1：可用
        roles: [],
      },
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
    };
  },
  mounted() {


  },

  methods: {
   
   
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
</style>
