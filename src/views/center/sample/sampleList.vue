<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">样品列表</div>
                    <div class="headerSearch">
                        <a-input-search v-model="searchValue" @search="sampleInfo" placeholder="样品名"
                            enter-button="搜索" />
                    </div>
                </div>
            </div>
            <div class="content-details">
                <div class="manageAll">
                    <a-button type="primary" @click="showAddSample">添加</a-button>
                    <a-button type="danger" style="margin-left: 10px;" @click="delMoreHandle">批量删除</a-button>
                </div>
                <a-table rowKey="id" :pagination="false" :data-source="dataSource" :columns="columns"
                    :loading="isloading" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :scroll="{ x: 1400, y: 1300 }">

                    <template slot="state" slot-scope="state">
                        {{ state == "A" ? '上架' : '下架' }}
                    </template>
                    <template slot="operation" slot-scope="text, record">
                        <div class="flex j-ey a-c">
                            <a @click="changeState(record)">{{ record.state == "A" ? '下架' : '上架' }}</a>
                            <a @click="editSample(record)">编辑</a>
                            <a style="color:red" @click="showDelModal(record.id)">删除</a>
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
        <a-modal @ok="delSampleList" v-model="deleteOpen" title="确认删除">
            <p>此操作不可逆，请确认</p>
        </a-modal>

        <!-- 新增客户 -->
        <a-modal cancelText="取消" :maskClosable="false" @ok="addSampleInfo" okText="保存" title="添加样品" v-model="addUser"
            width="45%">
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品名称：</div>
                <a-input v-model="addUserList.name" placeholder="请输入"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品型号：</div>
                <a-input v-model="addUserList.model" placeholder="请输入"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品系列：</div>
                <a-input v-model="addUserList.series" placeholder="请输入"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品工艺：</div>
                <a-input v-model="addUserList.workmanship" placeholder="请输入"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品排序：</div>
                <a-input v-model="addUserList.sort" placeholder="请输入"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品规格：</div>
                <a-input v-model="addUserList.specs" placeholder="请输入"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品面积：</div>
                <a-input v-model="addUserList.space" placeholder="请输入" addon-after="平方米"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">样品标价：</div>
                <a-input v-model="addUserList.price" placeholder="请输入" addon-after="元/片"></a-input>
            </div>
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">品牌名称：</div>
                <a-select ref="select" default-value="0" @change="changeBrandId"
                    style="width: 100%;margin-right: 10px;">
                    <a-select-option value="0">请选择
                    </a-select-option>
                    <a-select-option v-for="(item, index) in brandList" :key="index" :value="item.id">{{ item.name }}
                    </a-select-option>
                </a-select>
            </div>
            <div class="flex j-c a-c" style="margin-top: 10px">
                <div style="width: 100px">样品分类：</div>
                <a-select ref="select" default-value="0" @change="changeSampleTypeId"
                    style="width: 100%;margin-right: 10px;">
                    <a-select-option value="0">请选择
                    </a-select-option>
                    <a-select-option v-for="(item, index) in sampleTypeList" :key="index" :value="item.id">{{ item.name
                    }}
                    </a-select-option>
                </a-select>
            </div>
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">状态：</div>
                <a-radio-group v-model="addUserList.state" name="radioGroup" style="width: 100%;">
                    <a-radio value="A">上架</a-radio>
                    <a-radio value="D">下架</a-radio>
                </a-radio-group>
            </div>
            <!-- v-if="addUserList.rotateImgList.length < 5" -->
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">轮播图片：</div>
                <div style="width: 100%">
                    <a-upload @change="changeRotateImgs" @preview="handlePreview" :file-list="rotateImgList"
                        :action="getupload" :headers="{ 'token': token }" list-type="picture-card">
                        <div v-if="rotateImgList.length < 5">
                            <a-icon type="plus" />
                            <div style="margin-top: 8px">上传图片</div>
                        </div>
                    </a-upload>
                    <p>可以上传5张图片，分辨率3000px以下，大小不得超过10M</p>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                </div>
            </div>
            <!-- v-if="thumbnailImg.length < 1" -->
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">缩略图：</div>
                <div style="width: 100%">
                    <a-upload @change="changeRotateImgsTwo" @preview="handlePreviewTwo" :file-list="thumbnailImg"
                        :headers="{ 'token': token }" :action="getupload" list-type="picture-card">
                        <div v-if="thumbnailImg.length < 1">
                            <a-icon type="plus" />
                            <div style="margin-top: 8px">上传图片</div>
                        </div>
                    </a-upload>
                    <p>上传1张长宽比例为1:1的图片，用于小程序样品列表页展示</p>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelTwo">
                        <img alt="example" style="width: 100%" :src="previewImageTwo" />
                    </a-modal>
                </div>
            </div>
            <!-- v-if="addUserList.detailImgs.length < 20" -->
            <div class="flex j-c a-c" style="margin-top: 20px">
                <div style="width: 100px">详情图片：</div>
                <div style="width: 100%">
                    <a-upload :file-list="detailImgList" :headers="{ 'token': token }" :action="getupload"
                        @change="changeRotateImgsThree" @preview="handlePreviewThree" list-type="picture-card">
                        <div v-if="detailImgList.length < 20">
                            <a-icon type="plus" />
                            <div style="margin-top: 8px">上传图片</div>
                        </div>
                    </a-upload>
                    <p>可以上传多张图片，分辨率3000px以下，大小不得超过10M</p>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelThree">
                        <img alt="example" style="width: 100%" :src="previewImageThree" />
                    </a-modal>
                </div>
            </div>

        </a-modal>
    </div>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import API from "../../../service/api";
// 图片上传的时候用到
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
export default {
    data() {
        let columns = [
            {
                title: "样品ID",
                width: "190px",
                dataIndex: "id",
            },
            {
                title: "样品名",
                dataIndex: "name",
                width: "100px",
                scopedSlots: { customRender: "name" },
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
                title: "工艺",
                dataIndex: "workmanship",
                scopedSlots: { customRender: "workmanship" },
                width: 120,
            },
            {
                title: "品牌",
                dataIndex: "brand",
                scopedSlots: { customRender: "brand" },
                width: 120,
            },
            {
                title: "分类",
                dataIndex: "type",
                scopedSlots: { customRender: "type" },
                width: 120,
            },
            {
                title: "状态",
                width: 100,
                dataIndex: "state",
                scopedSlots: { customRender: "state" },
            },
            {
                title: "排序",
                dataIndex: "sort",
                width: "120px",
                scopedSlots: { customRender: "sort" },
            },
            {
                title: "操作",
                width: "160px",
                fixed: "right",
                dataIndex: "operation",
                scopedSlots: { customRender: "operation" },
            },
        ];
        columns = columns.map((item) => {
            return { ...item, align: "center" };
        });
        return {
            getupload: `${API.getApiPre('admin')}file/uploadImage`, //上传地址
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
            fileList: [],
            pageNo: 1,
            pageSize: 10,
            searchValue: "",
            addUserList: {},
            brandList: "",
            sampleTypeList: "",
            token: "",
            rotateImgList: [],
            thumbnailImg: [],
            detailImgList: [],
            previewVisible: false,
            previewImage: '',
            previewImageTwo: "",
            previewImageThree: "",
            upImgUrl: [],
            upImgUrlTwo: [],
            upImgUrlThree: [],
        }
    },

    mounted() {
        this.sampleInfo();
        this.brandChangenName();
        this.sampleTypeChange();
        this.token = localStorage.getItem('token')
    },



    methods: {
        // 分页改变
        changePage(page) {
            this.pageNo = page;
            this.sampleInfo();
        },
        // 分页的回调
        couponSizeChange(current, size) {
            this.pageNo = 1;
            this.pageSize = size;
            this.sampleInfo();
        },
        //删除弹出
        showDelModal(id) {
            this.ids = []
            this.deleteOpen = true;
            Array.isArray(id) ? this.ids = id : this.ids.push(id);
        },

        // 批量删除
        delMoreHandle() {
            if (this.selectedRowKeys.length <= 0) {
                this.$message.warning("请选择要删除条目", 1);
                return
            }
            this.showDelModal(this.selectedRowKeys)
        },
        //选择品牌名称
        changeBrandId(value) {
            this.addUserList.brandId = value
        },
        //选择样品分类
        changeSampleTypeId(value) {
            this.addUserList.sampleTypeId = value
        },
        //样品列表
        async sampleInfo() {
            let res = await API.sampleList(this.pageNo, this.pageSize, this.searchValue);
            this.dataSource = res.data.records;
            this.totalCount = res.data.total
        },
        //编辑样品
        editSample(item) {
            this.addUser = true
            this.addUserList = item
        },
        //添加样品
        showAddSample() {
            this.addUser = true
            this.addUserList = {}
            this.rotateImgList = []
            this.thumbnailImg = []
            this.detailImgList = [];
            this.brandList = ""
            this.sampleTypeList = ""
        },

        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },


        //点击上架下架
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
                state: code
            }
            let res = await API.updateSample(list);
            if (res.errorCode == 0) {
                this.$message.success("修改成功", 0.5);
                this.sampleInfo();
            }
        },


        //删除样品
        async delSampleList() {
            let res = await API.delSample(this.selectedRowKeys.length != 0 ? this.selectedRowKeys : this.ids);
            if (res.errorCode == 0) {
                this.$message.success("删除成功", 0.5);
                this.selectedRowKeys = [];
                this.ids = [];
                this.sampleInfo();
                this.deleteOpen = false;
            } else {
                this.$message.error(res.msg, 1);
            }
        },

        //新增样品
        async addSampleInfo() {
            let one = []
            let two = []
            for (var i = 0; i < this.upImgUrl.length; i++) {
                one.push(this.upImgUrl[i].fileName)
            }
            for (var i = 0; i < this.upImgUrlThree.length; i++) {
                two.push(this.upImgUrlThree[i].fileName)
            }
            this.addUserList.rotateImgList = one
            this.addUserList.thumbnailImg = this.upImgUrlTwo[0].fileName
            this.addUserList.detailImgList = two
            let res = await API.addSample(this.addUserList);
            if (res.errorCode == 0) {
                this.$message.success("添加成功", 0.5);
                this.addUser = false;
                this.sampleInfo();
                this.addUserList = {}
                this.rotateImgList = []
                this.thumbnailImg = []
                this.detailImgList = []
                this.brandList = ""
                this.sampleTypeList = ""
            }
        },

        // 品牌名称
        async brandChangenName() {
            let res = await API.brandChange();
            this.brandList = res.data
        },

        // 样品分类
        async sampleTypeChange() {
            let res = await API.sampleType();
            this.sampleTypeList = res.data
        },

        changeRotateImgs({ fileList }) {
            this.rotateImgList = fileList;
            if (fileList[fileList.length - 1].response) {
                this.upImgUrl = this.rotateImgList.map((item) => {
                    return item.response.data;
                });
            }
        },
        changeRotateImgsTwo({ fileList }) {
            this.thumbnailImg = fileList;
            if (fileList[fileList.length - 1].response) {
                this.upImgUrlTwo = this.thumbnailImg.map((item) => {
                    return item.response.data;
                });
            }
        },
        changeRotateImgsThree({ fileList }) {
            this.detailImgList = fileList;
            if (fileList[fileList.length - 1].response) {
                this.upImgUrlThree = this.detailImgList.map((item) => {
                    return item.response.data;
                });
            }
        },
        handleCancel() {
            this.previewVisible = false;
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImage = file.url || file.preview;
            this.previewVisible = true;
        },

        handleCancelTwo() {
            this.previewVisible = false;
        },
        handleCancelThree() {
            this.previewVisible = false;
        },
        async handlePreviewTwo(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImageTwo = file.url || file.preview;
            this.previewVisible = true;
        },

        async handlePreviewThree(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImageThree = file.url || file.preview;
            this.previewVisible = true;
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
