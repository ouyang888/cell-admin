<template>
  <div class="modal-wapper" ref="modalWapper">
    <a-modal
      :visible="visible"
      centered
      title="添加货品"
      :confirm-loading="false"
      width="70%"
      @ok="handleOK"
      :getContainer="getContainer"
      @cancel="handleCancel"
      :ok-button-props="{ props: { disabled: !selectedRowKeys.length } }"
    >
      <div>
        <a-row type="flex" justify="space-between" :gutter="[0, 10]">
          <a-col :span="11" class="flex a-c">
            <div class="search-key">产品品类：</div>
            <!-- <a-input
                    placeholder="请输入"
                    v-model="searchData.categories"
                    @keyup.enter="commodityInfoChecked(searchData)"
                    /> -->
            <a-select
              mode="tags"
              allowClear
              placeholder="请选择"
              v-model="searchData.categories"
              style="width: 100%"
            >
              <a-select-option v-for="name in oldCategoryList" :key="name">
                {{ name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="11" class="flex a-c">
            <div class="search-key">货品名称：</div>
            <a-input
              placeholder="请输入"
              v-model="searchData.commodityName"
              @keyup.enter="commodityInfoChecked(searchData)"
            />
          </a-col>
          <a-col :span="11" class="flex a-c">
            <div class="search-key">货品编码：</div>
            <a-input
              placeholder="请输入"
              v-model="searchData.commodityCode"
              @keyup.enter="commodityInfoChecked(searchData)"
            />
          </a-col>
          <a-col :span="11" class="flex a-c">
            <div class="search-key">货品成色：</div>
            <a-select
              mode="tags"
              allowClear
              placeholder="请选择"
              v-model="searchData.productGradings"
              style="width: 100%"
            >
              <a-select-option v-for="item in oldProductGradingList" :value="item.code+''" :key="item.code"> {{item.name}} </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="11" class="flex a-c">
            <div class="search-key">SN码：</div>
            <a-input
              placeholder="请输入"
              v-model="searchData.snCode"
              @keyup.enter="commodityInfoChecked(searchData)"
            />
          </a-col>
          <a-col :span="11" class="flex a-c">
            <div class="search-key">质检时间：</div>
                <a-range-picker
                  style="width: 100%"
                  v-model="date"
                  @change="dateChange"
                  :show-time="{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }"
                  format="YYYY-MM-DD HH:mm:ss"
              >
                  <a-icon slot="suffixIcon" type="clock-circle" />
              </a-range-picker>
          </a-col>
        </a-row>
        <a-row
          style="margintop: 15px; margin-bottom: 15px"
          justify="end"
          :gutter="16"
        >
          <a-col class="flex j-e" style="margin-top: 12px">
              <a-button type="primary" @click="search"> 查询 </a-button>
              <a-button @click="reset" style="margin-left: 10px">
                重置
              </a-button>
          </a-col>
        </a-row>
        <a-table
          style="margin-top: 10px"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: getCheckboxProps,
            type: radio ? 'radio' : 'checkbox',
          }"
          :pagination="pagination"
          :columns="productColumns"
          :data-source="productData"
          :loading="isLoading"
          rowKey="id"
          :scroll="{ y: offsetHeight-450, }"
          @change="tableChange"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import api from "@/service/api";
import { Divider, TreeSelect } from "ant-design-vue";
import moment from 'moment';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
export default {
  name: "addGoods",
  props: {
    idArr: {
      type: Array,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    fun: {
      type: Function,
    },
    radio: {
      type: Boolean,
    },
    commodityCategory: {
      type: Boolean,
    },
  },
  data() {
    return {
      moment,
      SHOW_PARENT,
      offsetHeight:document.body.offsetHeight,
      addUserList: [],
      isLoading: false,
      productColumns: [
        {
          title: "SN码",
          dataIndex: "snCode",
          width:120,
          //   scopedSlots: { customRender: "snCode" },
          customRender: (e, lineData) => {
            return (
              <div
                class={
                  this.idArr.includes(lineData.commodityId) ? "opacity-4" : ""
                }
              >
                {e}
              </div>
            );
          },
        },
        {
          title: "货品品类",
          dataIndex: "category",
          width:120,
          scopedSlots: { customRender: "category" },
          customRender: (e, lineData) => {
            return (
              <div
                class={
                  this.idArr.includes(lineData.commodityId) ? "opacity-4" : ""
                }
              >
                {e}
              </div>
            );
          },
        },
        {
          title: "货品编码",
          dataIndex: "commodityCode",
          width:140,
          scopedSlots: { customRender: "commodityCode" },
          customRender: (e, lineData) => {
            return (
              <div
                class={
                  this.idArr.includes(lineData.commodityId) ? "opacity-4" : ""
                }
              >
                {e}
              </div>
            );
          },
          
        },
        {
          title: "货品名称",
          dataIndex: "commodityName",
          scopedSlots: { customRender: "commodityName" },
          customRender: (e, lineData) => {
            return (
              <div
                class={
                  this.idArr.includes(lineData.commodityId) ? "opacity-4" : ""
                }
              >
                {e}
              </div>
            );
          },
        },
        {
          title: "货品成色",
          dataIndex: "productGrading",
          scopedSlots: { customRender: "productGrading" },
          width:80,
          customRender: (e, lineData) => {
            return (
              <div
                class={
                  this.idArr.includes(lineData.commodityId) ? "opacity-4" : ""
                }
              >
                {e}
              </div>
            );
          },
        },
        {
          title: "质检时间",
          dataIndex: "qualityTime",
          width:120,
          customRender: (e, lineData) => {
            return (
              <div
                class={
                  this.idArr.includes(lineData.commodityId) ? "opacity-4" : ""
                }
              >
                {e}
              </div>
            );
          },
        },
      ],
      productData: [],
      oldCategoryList: [],
      date: [], //日期
      searchData: {
        categories: [],
        commodityCode: "",
        commodityModel: "",
        commodityName: "",
        productGradings: [],
        qualityEndTime: "",
        qualityStartTime: "",
        snCode: "",
      },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 100,
        showSizeChanger: true,
        pageSizeOptions:["100","10","20","50","500"],
        showQuickJumper: true,
        showTotal: (total) => `合计${total}条`,
      },
      selectedRowKeys: [],
      oldProductGradingList:[],//成色list
      options: [],
    };
  },
  mounted() {
    // this.commodityInfoChecked();
    this.categoryList();
    this.generalList();
  },
  methods: {
    getContainer() {
      return this.$refs.modalWapper;
    },
    //获取分类
    async categoryList() {
      try {
        const result = await api.categoryList();
        this.oldCategoryList = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    //查询成色，状态列表
    async generalList(){
        try {
            const result = await api.generalList({group:"chengSe"})
            this.oldProductGradingList = result.data||[]
        } catch (error) {
            console.log(error)
        }
    },
    async commodityInfoChecked(data = this.searchData) {
      this.isLoading = true;
      const { current, pageSize } = this.pagination;
      try {
        const result = await api.commodityInfoChecked({
          ...data,
          snCodes:this.idArr||[],
          limit: pageSize,
          page: current,
          productGradings: data.productGradings.map((e) => e * 1),
        });
        if (result.success) {
          this.pagination.total = result.data.total;
          this.productData = result.data.records||[]
        }
      } catch (error) {
        console.log(error);
      }
      this.isLoading = false;
    },
    search() {
      this.selectedRowKeys = [];
      this.pagination.current=1
      this.commodityInfoChecked();
    },
    tableChange(pagination){
      this.pagination = pagination
      this.commodityInfoChecked();
    },
    reset() {
      this.selectedRowKeys = [];
      this.date = [];
      this.searchData = {
        categories: [],
        commodityCode: "",
        commodityModel: "",
        commodityName: "",
        productGradings: [],
        qualityEndTime: "",
        qualityStartTime: "",
        snCode: "",
      };
      this.pagination.current = 1;
      this.commodityInfoChecked();
    },
    dateChange(date, dateStr) {
      this.searchData.qualityStartTime = dateStr[0];
      this.searchData.qualityEndTime = dateStr[1]
    },
    handleOK() {
      this.$emit("addCommodity", this.addUserList);
      this.$emit("update:visible", false);
      this.addUserList = [];
    },
    handleCancel() {
      this.$emit("update:visible", false);
      this.addUserList = [];
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.addUserList = selectedRows;
    },
    getCheckboxProps(record) {
      this.selectedRowKeys = [];
      const isDisabled = this.idArr.some(
        (item) => record.commodityId == item
      );
      return {
        props: {
          disabled: isDisabled,
          name: record.userName,
        },
      };
    },
  },
  watch: {
    visible: function (val) {
      if (val) {
        this.productData = [];
        this.commodityInfoChecked();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.commodityName_over {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.modal-wapper {
  .search-key {
    width: 100px;
  }
}
.modal-wapper {
  ::v-deep.ant-table-pagination.ant-pagination {
    margin-bottom: 0;
  }
  ::v-deep.ant-table{
    font-size: 12px;
  }
}
</style>
