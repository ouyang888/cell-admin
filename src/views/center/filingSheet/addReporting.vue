<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="manageHeader">
                    <div class="titleContent">报备信息</div>
                </div>

                <div style="padding-left: 30px;width: 60%">
                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">报备性质：</div>
                        <a-radio-group v-model="value" name="radioGroup" style="width: 100%;">
                            <a-radio value="1">本区报备</a-radio>
                            <a-radio value="2">跨区报备</a-radio>
                        </a-radio-group>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 10px">
                        <div style="width: 100px">项目区域：</div>
                        <a-select
                            ref="select"
                            v-model="value"
                            style="width: 100%;"
                        >
                            <a-select-option value="jack">全部</a-select-option>
                        </a-select>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 10px">
                        <div style="width: 100px">报备类型：</div>
                        <a-select
                            ref="select"
                            v-model="value"
                            style="width: 100%;"
                        >
                            <a-select-option value="jack">全部</a-select-option>
                        </a-select>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 10px">
                        <div style="width: 100px">成交几率：</div>
                        <a-select
                            ref="select"
                            v-model="value"
                            style="width: 100%;"
                        >
                            <a-select-option value="jack">全部</a-select-option>
                        </a-select>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 10px">
                        <div style="width: 100px">用砖时间：</div>
                        <a-date-picker style="width: 100%;" />
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 120px">甲方单位：</div>
                        <a-input
                            v-model="addUserList.userName"
                            placeholder="公司"
                        ></a-input>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 120px">甲方项目负责人：</div>
                        <a-input
                            v-model="addUserList.userName"
                            placeholder=""
                        ></a-input>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 120px">乙方单位：</div>
                        <a-input
                            v-model="addUserList.userName"
                            placeholder="公司"
                        ></a-input>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 120px">乙方项目负责人：</div>
                        <a-input
                            v-model="addUserList.userName"
                            placeholder=""
                        ></a-input>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 120px">订单总金额：</div>
                        <a-input
                            v-model="addUserList.userName"
                            placeholder="123"
                            addon-after="元"
                        ></a-input>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">项目名称：</div>
                        <a-input
                            v-model="addUserList.userName"
                            placeholder="请输入"
                        ></a-input>
                    </div>
                    <div class="flex j-c a-c"  style="margin-top: 20px;align-items: start">
                        <div style="width: 100px">項目地址：</div>
                        <div style="width: 100%">
                            <div style="display: flex;margin-bottom: 10px;">
                                <a-select
                                    ref="select"
                                    v-model="value1"
                                    style="width: 120px;margin-right: 10px;"
                                    placeholder="省"
                                >
                                    <a-select-option value="jack">全部</a-select-option>
                                </a-select>
                                <a-select
                                    ref="select"
                                    v-model="value1"
                                    style="width: 120px;margin-right: 10px;"
                                    placeholder="市"
                                >
                                    <a-select-option value="jack">全部</a-select-option>
                                </a-select>
                                <a-select
                                    ref="select"
                                    v-model="value1"
                                    style="width: 120px;margin-right: 10px;"
                                    placeholder="区"
                                >
                                    <a-select-option value="jack">全部</a-select-option>
                                </a-select>
                            </div>
                            <div>
                                <a-input
                                    v-model="addUserList.password"
                                    placeholder="请输入详细地址"
                                ></a-input>
                            </div>
                        </div>
                    </div>
                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">报备备注：</div>
                        <a-textarea placeholder="此处显示备注内容" allow-clear />
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">用砖明细：</div>
                        <div style="width: 100%;">
                            <a-button @click="addDetailShow = true"> + 添加用砖明细</a-button>
                            <a-table :columns="modelColumns" :data-source="modelMsgSend" style="margin-top: 10px;">
                                <template slot="a" slot-scope="a">
                                    {{ a }}
                                </template>
                                <template slot="b" slot-scope="b">
                                    <a-input
                                        v-model="addUserList.password"
                                        placeholder="请输入密码"
                                    ></a-input>
                                    或
                                    <a-input
                                        v-model="addUserList.password"
                                        placeholder="请输入密码"
                                    ></a-input>
                                    {{b}}
                                </template>
                                <template slot="c" slot-scope="c">
                                    {{ c }}
                                </template>
                            </a-table>
                        </div>
                    </div>

                    <div class="flex j-c a-c" style="margin-top: 20px">
                        <div style="width: 100px">项目图片：</div>
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
                            <p>需至少上传3张图片，包括沟通记录截图、量房图片以及尺寸图、量房照片和收款凭证</p>
                        </div>

                    </div>

                    <a-button type="primary">保存</a-button>
                </div>
            </div>
        </div>

        <a-modal v-model="addDetailShow" title="添加用砖明细" width="40%" :footer="null">
            <a-input-search
                v-model="value"
                placeholder="搜索用砖型号、样品名称"
                enter-button="搜索"
            />

            <div class="sampleList">
                <div class="sampleBox">
                    <div class="sampleLeft">
                        <div class="sampleImg">
                            <img src="@/assets/img/logo.jpg" />
                        </div>
                        <div class="sampleMsg">
                            <h4>样品名称</h4>
                            <p>LJFY222111</p>
                            <span>标价：￥345/片</span>
                        </div>
                    </div>
                    <div class="sampleBtn">
                        <a-button>添加</a-button>
                    </div>
                </div>
                <div class="sampleBox">
                    <div class="sampleLeft">
                        <div class="sampleImg">
                            <img src="@/assets/img/logo.jpg" />
                        </div>
                        <div class="sampleMsg">
                            <h4>样品名称</h4>
                            <p>LJFY222111</p>
                            <span>标价：￥345/片</span>
                        </div>
                    </div>
                    <div class="sampleBtn">
                        <a-button>添加</a-button>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
export default {
    name: "addReporting",
    data(){
        return{
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
                }
            ],
            modelMsgSend: [],
            fileList: [],
        }
    }
}
</script>

<style lang="scss" scoped>
.sampleList{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}
.sampleBox{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .sampleLeft{
        display: flex;
        align-items: center;
        margin-right: 20px;
        .sampleMsg{
            h4{
                font-size: 14px;
                margin-bottom: 0;
                font-weight: bold;
            }
            p{
                font-size:12px;
                margin-bottom: 0;
                color: #bababa;
            }
            span{
                font-size:12px;
                color: #bababa;
            }
        }
    }
}
</style>
