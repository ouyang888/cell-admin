<template>
    <div class="page-header flex j-b" :class="product">
        <div>
            <a-breadcrumb separator="">
                <template v-for="(item,index) in breadcrumb" >
                    <a-breadcrumb-item style="color: #d9d9d9" :key="item">
                        {{item}}
                        <a-breadcrumb-separator v-if="index != breadcrumb -1" />
                    </a-breadcrumb-item>
                </template>
            </a-breadcrumb>
            <a-page-header class="page-header-title" :title="title" v-if="title"/>
            <div v-show="manuscriptTitle" class="manuscript">
                {{manuscriptTitle}}
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    name: "page-header",
    props: {
        title: String,
        breadcrumb: Array,
        product:String,
        manuscriptTitle:String
    },
});
</script>
<style lang="scss" scoped>
.page-header {
    padding: 5px 24px;
    position: relative;
    .manuscript{
        background: #F59A23;
        position: absolute;
        left: 138px;
        top: 37px;
        padding: 0 7px;
        color: #fff;
    }
}
.product {
    padding: 15px 24px;
}
.page-header-title {
    padding: 5px 0;
}
</style>