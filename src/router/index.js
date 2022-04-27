import Vue from 'vue'
import store from "../store";
import VueRouter, {
    RouteConfig
} from 'vue-router'
// import Home from '../views/Home.vue'
import {
    getToken
} from '@/utils/auth';
import {
    api
} from '@/config/index'


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '',
        redirect: '/center/index'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue'),
    },

    {
        path: '/center',
        name: 'center',
        component: () => import('@/views/center/center.vue'),

        children: [
            {
                path: 'index',
                name: 'index',
                component: () => import('@/views/center/index/index.vue')
            },
            {
                path: 'management',
                name: 'management',
                component: () => import('@/views/center/management/management.vue')
            },
            {
                path: 'userList',
                name: 'userList',
                meta: {
                    preMenuUrl: "/center/userManagement"
                },
                component: () => import('@/views/center/userManagement/userList.vue')
            },
            {
                path: 'sample',
                name: 'sample',
                meta: {
                    preMenuUrl: "/center/userManagement"
                },
                component: () => import('@/views/center/userManagement/sample.vue')
            },
            {
                path: 'distribution',
                name: 'distribution',
                meta: {
                    preMenuUrl: "/center/userManagement"
                },
                component: () => import('@/views/center/userManagement/distribution.vue')
            },
            {
                path: 'sampleList',
                name: 'sampleList',
                meta: {
                    preMenuUrl: "/center/sample"
                },
                component: () => import('@/views/center/sample/sampleList.vue')
            },
            {
                path: 'classified',
                name: 'classified',
                meta: {
                    preMenuUrl: "/center/sample"
                },
                component: () => import('@/views/center/sample/classified.vue')
            },
            {
                path: 'brand',
                name: 'brand',
                component: () => import('@/views/center/brand/brand.vue')
            },
            {
                path: 'filingSheet',
                name: 'filingSheet',
                component: () => import('@/views/center/filingSheet/filingSheet.vue')
            },
            {
                path: 'addReporting',
                name: 'addReporting',
                component: () => import('@/views/center/filingSheet/addReporting.vue')
            },
            {
                path: 'saleList',
                name: 'saleList',
                meta: {
                    preMenuUrl: "/center/sale"
                },
                component: () => import('@/views/center/sale/saleList.vue')
            },
            {
                path: 'editSale',
                name: 'editSale',
                meta: {
                    preMenuUrl: "/center/sale"
                },
                component: () => import('@/views/center/sale/editSale.vue')
            },
            {
                path: 'saleChannel',
                name: 'saleChannel',
                meta: {
                    preMenuUrl: "/center/sale"
                },
                component: () => import('@/views/center/sale/saleChannel.vue')
            },
        ]
    }]
const router = new VueRouter({
    routes
})
/**
 * 路由守卫
 */
router.beforeEach(async (to, from, next) => {
    // if (to.name !== 'login') {
    //     const authoritys = await store.dispatch('setUserAuthoritys')
    //     if (to.fullPath==="/center"&&from.fullPath!=="/center") {
    //         if (authoritys.includes('admin:quality')) {
    //             next('/center/qualityList');
    //             return
    //         }
    //     }
    // if (to.meta.permission) {
    //     let sign = false
    //     if (to.meta.permission instanceof Array) {
    //         to.meta.permission.forEach(item => {
    //             if (authoritys.indexOf(item) >= 0) {
    //                 sign = true
    //             }
    //         })
    //     } else if (authoritys.indexOf(to.meta.permission) > -1) sign = true

    //     if (!sign) {
    //         // if (to.name == 'login') {
    //         //     console.log("进入coupon权限不足");
    //         //     // next('/login');
    //         // } else {
    //         console.log('权限不足')
    //         // }
    //         return;
    //     }
    // }
    // }
    next();
})

export default router
