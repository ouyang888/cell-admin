<template>
  <div>
    <a-layout id="components-layout-demo-fixed-sider">
      <a-layout-sider
        v-model="collapsed"
        :style="{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }"
      >
        <div class="logo flex a-c">
          <img style="height: 100%" src="@/assets/img/logo.jpg" />
          <div style="margin-left: 10px" v-show="!collapsed">盘古质检平台</div>
        </div>
        <a-menu
          theme="dark"
          mode="inline"
          :defaultOpenKeys="['工单管理','基础数据','系统管理','设置']"
          v-model="searchKeys"
        >
          <!-- <a-menu-item key="/center/qualityList" v-permission="'admin:quality'">
            <router-link to="/center/qualityList"
              ><a-icon type="pie-chart" /> {{ collapsed ? "" : "质检列表" }}
            </router-link>
          </a-menu-item> -->

          <a-sub-menu key="工单管理" >
            <span class="nav-text" slot="title"
              ><a-icon type="profile" /><span>工单管理</span></span
            >
            <a-menu-item

            >
              <!-- <router-link to="/center/order"> 工单列表 </router-link> -->
            </a-menu-item>
          </a-sub-menu>



        </a-menu>
      </a-layout-sider>
      <a-layout
        :class="
          !collapsed ? 'right-content' : 'right-content right-content-indent'
        "
      >
        <a-layout-header class="header">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
          <div>
            <a-button
              @click="searchResult"
              type="primary"
              style="margin-right: 10px"
              v-permission="'admin:progress'"
            >
              查看进度
            </a-button>
            <a-popover placement="bottomRight">
              <template slot="content">
                <a @click="logOut">退出登录</a>
              </template>
              <a-avatar icon="user" style="margin-right: 10px" />{{
                getAccount
              }}
            </a-popover>
          </div>
        </a-layout-header>
        <a-layout-content class="layout-content">
          <keep-alive include="qualityList,outside,order">
            <router-view :collapsedClose="collapsedClose" />
          </keep-alive>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <div class="modal-wrapper" ref="modalWrapper">
      <a-modal
        :width="$store.state.modalWidth + '%'"
        :dialog-style="{
          top: `calc(20% + ${$store.state.mouseY}px)`,
          left: `${$store.state.mouseX}px`,
        }"
        :bodyStyle="{ padding: 0 }"
        :footer="null"
        :afterClose="() => $store.commit('afterClose')"
        v-model="$store.state.previewVisible"
      >
        <img
          @mousedown="(e) => $store.dispatch('mouseStart', e)"
          @mousemove="(e) => $store.dispatch('mouseIng', e)"
          @mouseup="$store.commit('mouseup')"
          alt="example"
          style="width: 100%"
          :src="$store.state.previewImage"
        />
      </a-modal>
      <download />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import API from "../../service/api";
import { getAccount, removeToken } from "@/utils/auth";
import download from "@/views/download/download.vue";
export default Vue.extend({
  data() {
    return {
      collapsed: true,
      getAccount: getAccount(),
      routes: [
        {
          path: "index",
          breadcrumbName: "First-level Menu",
        },
        {
          path: "first",
          breadcrumbName: "Second-level Menu",
        },
        {
          path: "second",
          breadcrumbName: "Third-level Menu",
        },
      ],
      searchKeys: [this.$route.path, this.$route.meta.preMenuUrl || ""],
    };
  },
  components: {
    download,
  },
  methods: {
    setSessionStorage(key, value) {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    collapsedClose() {
      this.collapsed = true;
    },
    searchResult() {
      this.$store.commit("cutDownloadVisible");
    },
    // 退出登录
    async logOut() {
      try {
        const { code } = await API.logOut();
        if (code === 0) {
          removeToken();
          this.$router.replace({ name: "login" });
        }
      } catch (error) {
        console.log(error);
      }
    },
    /* 图片框end */
  },
  computed: {
    titleNav() {
      return this.$route.meta.title;
    },
  },
  watch: {
    $route: function (val) {
      if (val.meta.preMenuUrl || this.$route.path) {
        this.searchKeys = [this.$route.path, val.meta.preMenuUrl || ""];
      }
    },
  },
});
</script>
<style lang="scss" scoped>
#components-layout-demo-fixed-sider .logo {
  height: 40px;
  width: 160px;
  color: #fff;
  font-size: 16px;
  margin: 16px;
}
.trigger {
  font-size: 18px;
  line-height: 50px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
}
.right-content {
  margin-left: 200px;
  overflow: hidden;
  height: 100vh;
}
.right-content-indent {
  margin-left: 80px;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 0 20px 0 0;
  z-index: 1;
  background: #fff;
  height: 50px;
  line-height: 50px;
  box-shadow: 0 0 3px 1px #eee;
}
.layout-content {
  overflow: auto;
}
</style>
