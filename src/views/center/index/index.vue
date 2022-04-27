<template>
    <div class="containter" style="overflow: hidden">
        <div class="content" ref="content">
            <div class="content-search">
                <div class="titleContent">管理首页</div>
                <div class="manageData">
                    <div class="manageDataBox">
                        <div class="dataBoxImg">
                            <img src="@/assets/img/logo.jpg" />
                        </div>
                        <div class="dataBoxMsg">
                            <h4>20</h4>
                            <p>客户数</p>
                        </div>
                    </div>
                    <div class="manageDataBox">
                        <div class="dataBoxImg">
                            <img src="@/assets/img/logo.jpg" />
                        </div>
                        <div class="dataBoxMsg">
                            <h4>20</h4>
                            <p>样品数</p>
                        </div>
                    </div>
                    <div class="manageDataBox">
                        <div class="dataBoxImg">
                            <img src="@/assets/img/logo.jpg" />
                        </div>
                        <div class="dataBoxMsg">
                            <h4>20</h4>
                            <p>品牌数</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-details">
                <div class="manageDataChart">
                    <div class="chartData">
                        <h3>报备统计</h3>
                        <p>显示近1年各月报备单数量</p>
                        <div class="chartBox">
                            <img src="@/assets/img/logo.jpg" />
                        </div>
                    </div>
                    <div class="chartData">
                        <h3>销售统计</h3>
                        <p>显示近1年各月销售单数量</p>
                        <div class="chartBox">
                            <img src="@/assets/img/logo.jpg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.manageData{
    margin-top:20px;
    display: flex;
    align-items: center;
    .manageDataBox{
        display: flex;
        align-items: center;
        //justify-content: center;
        flex: 1;
        .dataBoxMsg{
            margin-left: 10px;
            h4{
                font-size: 26px;
                margin-bottom: 0;
                font-weight: bold;
            }
            p{
                margin-bottom: 0;
            }
        }
    }
}

.manageDataChart{
    display: flex;
    .chartData{
        margin-right: 40px;
    }
}
</style>
