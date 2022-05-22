<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">报备信息</div>
                </div>

                <div style="padding-left: 30px;width: 60%">
                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">销售性质：</div>
                        <a-radio-group v-model="formData.nature" name="radioGroup" style="width: 100%;">
                            <a-radio value="1">本区销售</a-radio>
                            <a-radio value="2">跨区销售</a-radio>
                        </a-radio-group>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 10px">
                        <div style="width: 100px">用砖区域：</div>
                        <a-select
                            ref="select"
                            v-model="formData.salesAreaId"
                            style="width: 100%;"
                        >
                            <a-select-option v-for="item in salesAreaList" :key="item.id" :value="item.id">
                                {{item.address}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 10px">
                        <div style="width: 100px">销售渠道：</div>
                        <a-select
                            ref="select"
                            v-model="formData.salesChannelId"
                            style="width: 100%;"
                        >
                            <a-select-option v-for="item in salesDownList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 10px">
                        <div style="width: 100px">订单日期：</div>
                        <a-date-picker v-model="formData.datetimeOrder" style="width: 100%;"/>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 10px">
                        <div style="width: 100px">送货日期：</div>
                        <a-date-picker v-model="formData.datetimeDelivery" style="width: 100%;"/>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">业主名称：</div>
                        <a-input
                            v-model="formData.ownerName"
                            placeholder="请输入"
                        ></a-input>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">业主电话：</div>
                        <a-input
                            v-model="formData.ownerPhone"
                            placeholder="请输入"
                        ></a-input>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">订单总金额：</div>
                        <a-input
                            v-model="formData.totalAmount"
                            placeholder="123"
                            addon-after="元"
                        ></a-input>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 20px;align-items: start">
                        <div style="width: 100px">用砖地址：</div>
                        <div style="width: 100%">
                            <div style="display: flex;margin-bottom: 10px;">
                                <v-distpicker :province="selected.province"
                                              :city="selected.city"
                                              :area="selected.area"
                                              @selected="onSelectedAddress"
                                />
                            </div>
                            <div>
                                <a-input
                                    v-model="formData.detailedAddress"
                                    placeholder="请输入详细地址"
                                ></a-input>
                            </div>
                        </div>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">销售备注：</div>
                        <a-textarea v-model="formData.remark" placeholder="此处显示备注内容" allow-clear/>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px" @click="getBrickDetail()">用砖明细：</div>
                        <div style="width: 100%;">
                            <a-button @click="getBrickDetail()"> + 添加用砖明细</a-button>
                            <a-table
                                :rowKey="(record,index)=>{return index}"
                                :pagination="false"
                                :columns="modelColumns"
                                :data-source="formBrickList"
                                style="margin-top: 10px;"
                            >
                                <template slot="a" slot-scope="progress,lineData">
                                    {{ lineData.model }} {{ lineData.name }}
                                </template>

                                <template slot="b" slot-scope="progress,lineData">
                                    <a-input @input="spaceNumInput(lineData)"
                                             :disabled="lineData.spaceInput != '' && lineData.spaceInput != null" style="width: 100px"
                                             v-model="lineData.number"></a-input>
                                    或
                                    <a-input @input="spaceNumInput(lineData)" :disabled="lineData.number != '' && lineData.number != null"
                                             style="width: 100px" v-model="lineData.spaceInput"></a-input>
                                </template>

                                <template slot="count" slot-scope="progress,lineData">
                                    {{lineData.count}}
                                </template>

                                <template slot="d" slot-scope="progress,lineData">
                                    <a-input
                                        v-model="lineData.price"
                                        addon-after="元/片"
                                    ></a-input>
                                </template>
                            </a-table>
                        </div>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">项目图片：</div>
                        <div style="width: 100%">
                            <a-upload @change="changeRotateImgs" @preview="handlePreview" :file-list="rotateImgList"
                                      :action="getupload" :headers="{ 'token': token }" list-type="picture-card">
                                <div>
                                    <a-icon type="plus"/>
                                    <div style="margin-top: 8px">上传图片</div>
                                </div>
                            </a-upload>
                            <p>需至少上传3张图片，包括沟通记录截图、量房图片以及尺寸图、量房照片和收款凭证</p>
                            <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                                <img alt="example" style="width: 100%" :src="previewImage"/>
                            </a-modal>
                        </div>

                    </div>

                    <a-button type="primary" @click="saveHandle()">保存</a-button>
                </div>
            </div>
        </div>

        <a-modal v-model="addDetailShow" title="添加用砖明细" width="40%" :footer="null">
            <a-input-search
                v-model="brickSearch"
                placeholder="搜索用砖型号、样品名称"
                enter-button="搜索"
                @search="brickSearchHandle()"
            />

            <div class="sampleList">
                <div class="sampleBox" v-for="item in brickDataList" :key="item.id">
                    <div class="sampleLeft">
                        <div class="sampleImg">
                            <img src="@/assets/img/logo.jpg"/>
                            <!--                            <img :src="item.thumbnailImg"/>-->
                        </div>
                        <div class="sampleMsg">
                            <h4>{{item.name}}</h4>
                            <p>{{item.model}}</p>
                            <span>标价：￥{{item.price}}/片</span>
                        </div>
                    </div>
                    <div class="sampleBtn">
                        <a-button @click="addBrickHandle(item)">添加</a-button>
                    </div>
                </div>
                <div v-if="brickDataList.length==0" style="text-align: center">暂没数据</div>


            </div>
        </a-modal>
    </div>
</template>

<script>
    import API from "../../../service/api";
    import VDistpicker from 'v-distpicker';

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
        components: {VDistpicker},
        name: "addReporting",
        data() {
            return {
                token: "",
                getupload: `${API.getApiPre('admin')}file/uploadImage`,
                customerId:null,
                formData: {},
                salesAreaList: [],
                salesDownList: [],

                addDetailShow: false,
                value: '',
                addUserList: {},
                modelColumns: [
                    {
                        title: "样品幸好&名称",
                        dataIndex: "a",
                        scopedSlots: {customRender: "a"},
                    },
                    {
                        title: "用砖数量（片）或用砖面积（平方米）",
                        dataIndex: "b",
                        scopedSlots: {customRender: "b"},
                    },
                    {
                        title: "需样品数量",
                        dataIndex: "c",
                        scopedSlots: {customRender: "c"},
                    },
                    {
                        title: "成交单价",
                        dataIndex: "d",
                        scopedSlots: {customRender: "d"},
                    }
                ],
                formBrickList: [],
                previewImage: '',
                brickSearch: null,
                brickDataList: [],
                previewVisible: false,
                rotateImgList: [],

                selected: {
                    province: "",
                    city: "",
                    area: ""
                },
            }
        },
        mounted() {
            this.getSalesAreaList()
            this.getSalesDownList()
            this.getDetail()
            this.token = localStorage.getItem('token')
        },
        methods: {
            // 项目区域 下拉数据
            async getSalesAreaList() {
                let res = await API.salesAreaList();
                this.salesAreaList = res.data.records
            },
            // 项目区域 下拉数据
            async getSalesDownList() {
                let res = await API.salesDownList();
                this.salesDownList = res.data
            },

            // 获取用砖明细
            async getBrickDetail() {
                let res = await API.selectCustomerSamplelList('', '', this.customerId);
                this.brickDataList = this.brickTempList = res.data.records
                this.addDetailShow = true
            },

            // 搜索用砖明细
            brickSearchHandle() {
                if (!this.brickSearch) {
                    this.getBrickDetail()
                    return
                }

                this.brickDataList = this.brickTempList.filter(item => {
                    return item.name.includes(this.brickSearch) || item.model.includes(this.brickSearch)
                })
            },

            // 省市区联动
            onSelectedAddress(data) {
                const {province, city, area} = data;
                if (!province.code && !city.code && !city.code) return;
                this.selected.province = province.value;
                this.selected.city = city.value;
                this.selected.area = area.value;
            },

            // 选择图片
            changeRotateImgs({fileList}) {
                this.rotateImgList = fileList;
                if (fileList.length > 0) {
                    if (fileList[fileList.length - 1].response) {
                        this.upImgUrl = this.rotateImgList.map((item) => {
                            return item.response.data;
                        });
                    }
                }
            },

            // 放大图片
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },

            // 添加用砖
            addBrickHandle(data) {
                this.$set(data, 'count', null);
                this.$set(data, 'spaceInput', null);
                this.$set(data, 'number', null);
                // this.$set(data, 'price', null);
                this.formBrickList = JSON.parse(JSON.stringify(this.formBrickList))
                this.formBrickList.push(data);
            },


            // 计算出需求样品数量
            spaceNumInput(data) {
                if (data.number !== "" && data.number !== null) {
                    this.$set(data, 'count', data.number)
                    return
                }

                if (data.spaceInput !== "" && data.spaceInput !== null) {
                    if (!data.space || data.space == "") {
                        data.space = 0
                    }
                    let countSum = parseFloat(data.spaceInput) / data.space
                    this.$set(data, 'count', countSum)
                    return
                }

                if ((data.spaceInput == "" && data.number == "") || (data.spaceInput == null && data.number == null)) {
                    this.$set(data, 'count', "")
                }
            },

            // 表单校检
            getFormCheck() {
                return new Promise((resolve, reject) => {
                    // if (this.rotateImgList.length < 3) {
                    //     this.$message.warning("至少上传3张图片", 1);
                    //     reject("error");
                    // }
                    resolve()
                })
            },

            // 保存报备单
            saveHandle() {
                this.getFormCheck().then(() => {
                    let data = this.formData;
                    data.type = "save"

                    // 省市区赋值
                    data.address = `${this.selected.province}${this.selected.city}${this.selected.area}`


                    // 表格数据整理
                    let formBrickList = this.formBrickList.map(item => {
                        return {
                            number: item.number,
                            sampleId: item.sampleTypeId || item.sampleId,
                            space: item.spaceInput,
                            price:item.price
                        }
                    })


                    // 图片数据整理
                    let rotateImgList = this.rotateImgList.map(item => {
                        console.log(item);
                        return item.response.data.fileName
                    })

                    data.details = formBrickList
                    data.imgList = rotateImgList

                    API.salesUpdateEdit(data).then(res => {
                        if (res.errorCode == "0") {
                            this.$message.success("保存成功", 1);
                            this.$router.push({path: '/center/saleList'});
                        }
                    })
                })


            },

            // 获取详情
            async getDetail() {
                let res = await API.salesDetail(this.$route.query.id)
                this.customerId = res.data.customerId;
                this.formData = res.data;

                // 省市区拆分赋值
                let reg = /.+?(省|市|自治区|自治州|县|区)/g;
                let regArr = res.data.address.match(reg);
                this.selected.province = regArr[0];
                this.selected.city = regArr[1];
                this.selected.area = regArr[2];


                // 图片赋值
                if (res.data.imgList && res.data.imgList.length !== 0) {
                    this.rotateImgList = res.data.imgList.map((item, index) => {
                        return {
                            name: item,
                            status: 'done',
                            url: `https://changhejiaju.com.cn/dms/api/picture/${item}`,
                            uid: index,
                            response: {
                                data: {
                                    fileName: item
                                }
                            }
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sampleList {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .sampleBox {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .sampleLeft {
            display: flex;
            align-items: center;
            margin-right: 20px;

            .sampleMsg {
                h4 {
                    font-size: 14px;
                    margin-bottom: 0;
                    font-weight: bold;
                }

                p {
                    font-size: 12px;
                    margin-bottom: 0;
                    color: #bababa;
                }

                span {
                    font-size: 12px;
                    color: #bababa;
                }
            }
        }
    }
</style>
