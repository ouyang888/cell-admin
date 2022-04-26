<template>
        <a-modal
            title="下载进度"
            :dialog-style="{ padding:0, top: '0px',marginRight:'0px'}"
            :bodyStyle="{padding:'20px',height:(offsetHeight-56)+'px'}"
            :mask="false"
            :visible="$store.state.downloadVisible"
            @ok="() => setModal1Visible()"
            :footer="null"
            :closable="false"
            @cancel="() => setModal1Visible()"
            width='400px'
        >
              <a-table
                :columns="columns"
                :data-source="data"
                rowKey="id"
                size="small"
                :pagination=false
                :loading="loading"
                :scroll="{ y:offsetHeight-160 }"
            >
                <!-- :loading="posting" -->
                <template slot="progress"  slot-scope="progress,lineData">
                    <a-progress :percent="progress" :status="lineData.status==2?'success':lineData.status==1?'normal':'exception'" size="small" />
                </template>
                <template slot="status" slot-scope="status,lineData">
                    <span v-show="status==1">上传中</span>
                    <span v-show="status==3">上传失败</span>
                    <a v-show="status==2" :href="lineData.url" v-permission="'admin:progress:download'">下载</a>
                </template>
            </a-table>
            <div class="pagination flex j-e a-c">
                <span style="marginRight:4px">
                    合计{{total}}条 
                </span>
                <a-pagination :total="total*1" size="small" show-size-changer @showSizeChange="productSizeChange" @change="pageChange" v-model="searchData.page"/>
            </div>
        </a-modal>
    <!-- </div> -->
</template>
<script>
import api from "@/service/api";
// downloadPage
export default {
    name:"download",
    data() {
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '进度',
                dataIndex: 'progress',
                width:80,
                scopedSlots: { customRender: 'progress' },
            },
            {
                title: '操作',
                dataIndex: 'status',
                width:80,
                scopedSlots: { customRender: 'status' },
            }
        ];
        return {
            // modal1Visible: thsi.,
            searchData:{
                page:1,
                limit:10
            },
            data:[],
            columns,
            total:0,
            loading:false,
            setInterval:'',//定时器的标识
            unfinished:0,//不为0就是还有下载
            offsetHeight:document.body.offsetHeight,
            height:document.body.offsetHeight-55
        }
    },
    mounted(){
        this.loading = true
        this.downloadPage()
    },
    methods: {
        async downloadPage (){
            try {
                const {code,data} = await api.downloadPage(this.searchData)
                if (code==0) {
                    this.data = data.page.list
                    this.total = data.page.totalCount
                    this.unfinished = data.unfinished
                    if (data.unfinished==0) clearInterval(this.setInterval)
                }
            } catch (error) {
                console.log(error)
            }
            this.loading = false
        },
        setModal1Visible() {
            this.$store.commit('cutDownloadVisible')
        },
        // 分页器
        pageChange(page){
            this.searchData.page = page
            this.downloadPage()
        },
        productSizeChange(current, size){
            this.searchData.page = 1
            this.searchData.limit = size
            this.downloadPage()
        },
    },
    computed:{
        downloadVisible(){
            return this.$store.state.downloadVisible
        }
    },
    // 过滤器
    filters: {
    },
    watch:{
        downloadVisible:function (val) {
            if(val){
                this.downloadPage()
                this.unfinished=1
                if (this.unfinished>0) {
                    this.setInterval=setInterval(() => {
                        this.downloadPage()
                    }, 5000);
                }
            }else clearInterval(this.setInterval)
        }
    }
};
</script>
<style lang="scss" scoped>
.pagination{
    padding:5px;
    font-size: 12px;
}
</style>
