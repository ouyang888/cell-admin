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
        <a-row :gutter="[50, 10]">
          <a-col :span="8" class="flex j-ey a-c">
            <span style="width: 100px">角色：</span>
            <a-select
              :allowClear="true"
              mode="multiple"
              placeholder="请输入"
              v-model="searchdata.roles"
              :style="{ width: '100%' }"
              :maxTagCount="2"
            >
              <div slot="maxTagPlaceholder">
                + {{ searchdata.roles && searchdata.roles.length - 2 }}
              </div>
              <a-select-option v-for="item in roleListData" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>

      <div class="content-header flex">
        <div class="header-right">
          <a-button
            v-permission="'admin:setting:userList:add'"
            class="editable-add-btn"
            style="margin-left: 10px"
            type="primary"
            @click="addUser = true"
            >新建账号</a-button
          >
        </div>
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
          <template slot="operation" slot-scope="lineData">
            <div class="flex j-ey a-c">
              <a
                @click="reRetUseInfo(lineData)"
                v-permission="'admin:setting:userList:update'"
                >编辑</a
              >
              <a
                v-permission="'admin:setting:userList:impower'"
                @click="openTransferModel('授权', { id: lineData.id })"
              >
                授权
              </a>
              <a
                v-permission="'admin:setting:userList:disable'"
                @click="
                  updateStatus({ id: lineData.id, status: lineData.enabled })
                "
              >
                {{ lineData.enabled == 1 ? "禁用" : "启用" }}
              </a>
              <a
                v-permission="'admin:setting:userList:copy'"
                @click="openTransferModel('权限复制', { id: lineData.id })"
              >
                权限复制
              </a>
            </div>
          </template>
          <template slot="enabled" slot-scope="text">
            <div :style="{ color: text == 0 ? 'red' : '' }">
              {{ text == 0 ? "禁用" : "正常" }}
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
    this.getSysUserList();
    this.showsysRoleList();
    this.setContentHeight();

    window.addEventListener("resize", () => {
      this.setContentHeight();
    });
  },
  destroyed() {
    window.removeEventListener("resize", () => {
      this.setContentHeight();
    });
  },
  methods: {
    setContentHeight() {
      this.contentHeight = this.$refs.content.offsetHeight;
    },
    changeRole(value) {
      this.typeId = value;
      this.sysUserImpower(this.useId, value);
    },

    async showsysRoleList() {
      let res = await API.sysRoleList({});
      this.roleListData = res.data.data;
    },
    async getSysUserList() {
      this.isloading = true;
      try {
        const result = await API.getSysUserList(this.searchdata);
        if (result.success) {
          this.dataSource = result.data.data.data;
          this.totalCount = result.data.data.total;
        }
      } catch (error) {
        console.log(error);
      }
      this.isloading = false;
      this.searchLoading = false;
    },
    // 更改用户姓名
    async sysUserUpdateUser(data) {
      try {
        const result = await API.sysUserUpdateUser(data);
        if (result.success) {
          this.$message.success("操作成功", 0.5);
          this.getSysUserList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async sysUserSwitch(data) {
      try {
        const result = await API.sysUserSwitch(data);
        if (result.success) {
          this.$message.success("操作成功", 0.5);
          this.getSysUserList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 用户授权
    async sysUserImpower(id) {
      try {
        const result = await API.sysUserImpower(id, this.typeId);
        if (result.success) {
          console.log(result.data.allData, "result.data.allData");
          this.mockData = result.data.allData || [];
          this.targetKeys = result.data.selectedData
            ? result.data.selectedData.map((item) => item.toString())
            : [];
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 修改用户授权
    async updateSysUserImpower(data) {
      try {
        const result = await API.updateSysUserImpower(data);
        if (result.success) {
          this.$message.success("修改成功", 0.5);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 复制用户列表
    async copyListRoleSysUser(id) {
      try {
        const result = await API.copyListRoleSysUser(id);
        if (result.success) {
          this.targetKeys = [];
          this.mockDataCopy = result.data || [];
          // this.targetKeys = result.data.selectedData||[]
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 复制用户
    async copyRoleSysUser(data) {
      try {
        const result = await API.copyRoleSysUser(data);
        if (result.success) {
          this.$message.success("操作成功", 0.5);
          this.getSysUserList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 搜索
    searchSysUserList(searchLoading) {
      if (searchLoading === true) this.searchLoading = true;
      this.searchdata.num = 1;
      this.getSysUserList();
    },
    // 重置
    reset() {
      (this.searchdata = {
        account: "", // 账号
        name: "",
        phone: "",
        num: 1,
        size: 10,
        status: [], // 0：不可用  1：可用
      }),
        this.getSysUserList();
    },
    // 选择逻辑
    handleChange(value) {
      console.log(`Selected: ${value}`);
    },
    popupScroll() {
      console.log("popupScroll");
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
    // 去详情页面
    toDetail(data) {
      this.$router.push({
        name: "detail",
        path: "detail",
        params: { detail: data },
        query: { id: data.id },
      });
    },
    rewirteCoupon(record) {
      if (record.status == 2) return;
      this.$router.push(`/center/addCoupon?id=${record.id}`);
    },
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    onDelete(key) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter((item) => item.key !== key);
    },
    handleAdd() {
      const { count, dataSource } = this;
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`,
      };
      this.dataSource = [...dataSource, newData];
      this.count = count + 1;
    },

    /* 修改状态start */
    updateStatus(data) {
      this.$Confirm(
        "提示",
        data.status == 1
          ? "禁用后，该账号无法登录使用，确定禁用吗?"
          : "启用后，该账号可正常登录使用，确定启用吗?",
        async () => {
          await this.sysUserSwitch(data);
        },
        "取消"
      );
    },
    /* 修改状态end */

    /* 穿梭器start */
    async openTransferModel(modelType, data) {
      this.typeId = "0";
      if (modelType == "授权") {
        this.useId = data.id;
        await this.sysUserImpower(data.id, this.typeId);
      } else {
        this.useId = data.id;
        await this.copyListRoleSysUser(data.id);
      }
      this.modelType = modelType;
      console.log(this.modelType, "this.modelType");
      this.showTransfer = true;
    },
    transferHandleChange(targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys;
    },
    transferSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      console.log(sourceSelectedKeys, targetSelectedKeys);
      this.mockDataCopyID = sourceSelectedKeys;
    },
    async transferOk() {
      try {
        if (this.modelType == "授权") {
          console.log("授权数据", this.targetKeys);
          await this.updateSysUserImpower({
            userId: this.useId,
            selectedData: this.targetKeys,
            type: this.typeId,
          });
          this.showTransfer = false;
        } else {
          await this.copyRoleSysUser({
            userId: this.useId,
            selectedData: this.mockDataCopyID,
          });
          this.showTransfer = false;
        }
        this.getSysUserList();
      } catch (error) {
        console.log(error);
      }

      console.log("点击了确认");
    },
    afterClose() {
      this.modelType = "";
    },
    mountModal() {
      return this.$refs.content;
    },
    /* 穿梭器end */
    /* 修改name start */
    reRetUseInfo(userInfo) {
      this.userInfo = JSON.parse(JSON.stringify(userInfo));
      this.showUserInfo = true;
    },
    async handleOk() {
      await this.sysUserUpdateUser(this.userInfo);
      this.showUserInfo = false;
    },
    async addUserOk() {
      this.addUserList["account"] = this.addUserList.phone;
      try {
        await API.sysUserAdd(this.addUserList);
        this.getSysUserList();
        this.addUser = false;
      } catch (error) {
        console.log(error);
      }
    },
    showUserInfoAfterClose() {
      this.userInfo = {
        phone: "",
        showUserInfo: "",
      };
    },
    /* 修改name end */
  },
  // 过滤器
  filters: {
    typeFormat(type) {
      return ["", "满减券", "折扣券", "无门槛"][type];
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
</style>
