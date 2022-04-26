<template>
  <div class="clearfix flex d-c" ref="uploadContain" :class="{'beyond':isScroll}">
    <a-upload
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
        :before-upload="beforeUpload"
        multiple
        :data="{
            imageKind:imageKind
        }"
        withCredentials
        :action="getupload"
        accept=".jpg,.jpeg,.png"
        :class="{'error-color':!fileList.length&&errorHint&&required,'remove-icon':isDetail}"
    >
        <div v-if="fileList.length <maxLength&&!isDetail">
            <a-icon type="plus" />
            <div class="ant-upload-text">
                上传图片
            </div>
        </div>
        <span v-if="!fileList.length&&errorHint&&required&&!isDetail" class="error-text">
            请上传图片
        </span>
    </a-upload>
    <div class="hint" v-show="!isDetail" @click="callBackData">
        {{hintTitle}}
    </div>
  </div>
</template>
<script>
import api from "@/service/api";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
    props: {
        hintTitle: { //图片下方字体
            type: String,
            default: ''
        },
        isVerifyUpload:{//是否提交错误报错
            type:String,
            default: ""
        },
        required:{//是否需要必填
            type:Boolean,
            default: true
        },
        nameId:String,
        imageArr:Array,//传入图片数组
        imageKind:String,
        imageLocation: String,
        isDetail:Boolean,
        maxLength:{//是否需要必填
            type:Number,
            default: 100
        }
    },
  data() {
    return {
        previewImage: '',
        fileList: [],
        getupload:`${api.getApiPre("admin")}admin/v1/qualityImage/upload`,//上传地址
        initSatus:false,
        errorHint:false
    };
  },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            if (!(this.imageArr instanceof Array)||this.imageArr.length<1) return
            this.fileList = this.imageArr.map((item,i)=>{
                return {
                    uid:i,
                    name:'image.png',
                    status:'done',
                    url:item&&`${item.imageUrl}?x-oss-process=image/resize,m_fill,h_200,w_200`,
                    response:{
                        data:{
                            ...item
                        }
                    }
                }
            })
        },
        callBackData(){
            let obj = {}
                obj.imageList = this.fileList.map((item)=>{
                    if (item.response&&item.response.data) {
                        const {imageName ,imageUrl} = item.response.data
                        return {
                            imageName:imageName,
                            imageUrl:imageUrl,
                        }
                    }else return {}
                    
                })
                obj.pass = this.required? this.fileList.every(item=>item.status=="done")&&this.fileList.length>0 : this.fileList.every(item=>item.status=="done")
                obj.nameId = this.nameId
            return obj
        },
        //由外界调用回传数据
        refUseCallBackData(){
            console.log("callBackData")
            this.$emit('callBackData',this.callBackData())
        },
        
        beforeUpload(file) {
            if (!this.initSatus)  this.initSatus = true
        },
        
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            const maxUrl =  file.url&&file.url.replace("?x-oss-process=image/resize,m_fill,h_200,w_200",'')
            this.$emit('showPreviewVisible', maxUrl || file.preview)
        },
        handleChange(info) {
            console.log(info,"info.event");
            if (info.fileList.length>this.maxLength) this.fileList.slice(0,this.maxLength)
            else this.fileList = info.fileList;
            const status = info.file.status;
            if (status !== 'uploading') {
            }
            if (status === 'done') {
            } else if (status === 'error') {
                console.log(info,"1234")
                this.$message.error(`${info.file.name} 上传失败.`,0.2);
            }
        },
    },
    computed:{
        isScroll(){
            const {uploadContain} = this.$refs
            const {fileList} = this
            if (uploadContain) {
                return uploadContain.clientWidth*9/10/fileList.length<120
            }
            return false
        }
    },
    watch:{
        fileList:{//深度监听，可监听到对象、数组的变化
            handler(val, oldVal){
                this.$emit('callBackData',this.callBackData())
            },
            deep:true, //true 深度监听
            immediate: true
        },
        imageArr:function (val,oldVal) {
            if (!this.initSatus && this.imageArr && this.imageArr.length > 0) {
                this.init()
                this.initSatus = true
            }
        },
        isVerifyUpload(val, oldVal){
            if (val!==oldVal) {
                this.errorHint = true
            }
        }
        // fileList:function () {
        //     this.$emit('callBackData',this.callBackData())
        // },
    }
};
</script>
<style lang="scss" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
/* 动态背景和边框 */
.beyond{
    .ant-upload-picture-card-wrapper{
        border: 1px solid #333;
        background: #F3F3F3;
        padding: 10px;
        padding-bottom: 5px; 
    }
}
.clearfix{
    .ant-upload-picture-card-wrapper{
        display: flex;
        overflow: auto;
        width: 100%;
        ::v-deep.ant-upload-select-picture-card{
            flex-shrink: 0;
            margin-bottom: 4px;
        }
        ::v-deep.ant-upload-list-item{
            margin-bottom: 4px;
        }
        ::v-deep.ant-upload-list-picture-card-container{
            margin-bottom: 4px;
            
        }
        ::v-deep.ant-upload-list-picture-card {
            display: flex;
        }
    }
    
    .error-color{
        ::v-deep.ant-upload-select-picture-card{
            border: 1px red solid;
            position: relative;
            .error-text{
                position: absolute;
                right: -82px;
                bottom: 38px;
                color: red;
            }
        }
    }
    .remove-icon{
        ::v-deep.anticon-delete{
            display: none;
        }
    }
    .hint{
        line-height: normal;
        /* margin-top: 4px; */
        color: #b7acac;
    }
}
</style>
