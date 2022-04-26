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

const routes = [{
    path: '/',
    name: '',
    redirect: '/center'
},
// {
//     path: '/login',
//     name: 'login',
//     meta: {
//         preMenuUrl: "/login",
//     },
//     component: () => import('@/views/login.vue')
// },

// {
//     path: '/center',
//     name: 'center',
//     component: () => import('@/views/center/center.vue'),
  
//     children: [{
//         path: 'qualityList',
//         name: 'qualityList',
//         meta: {
//             permission: "admin:quality",
//         },
//         component: () => import('@/views/center/quality/qualityList.vue')
//     },
//     {
//         path: 'addQuality',
//         name: 'addQuality',
//         meta: {
//             preMenuUrl: "/center/qualityList",
//             permission: "admin:quality:update",
//         },
//         component: () => import('@/views/center/quality/addQuality.vue')
//     },
//     {
//         path: 'permission',
//         name: 'permission',
//         meta: {
//             permission: "admin:setting:permissionList",
//         },
//         component: () => import('@/views/center/authority/permission.vue')
//     },
    
  
   
    // ]
// }
]
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
    //     if (to.meta.permission) {
    //         let sign = false
    //         if (to.meta.permission instanceof Array) {
    //             to.meta.permission.forEach(item => {
    //                 if (authoritys.indexOf(item) >= 0) {
    //                     sign = true
    //                 }
    //             })
    //         } else if (authoritys.indexOf(to.meta.permission) > -1) sign = true

    //         if (!sign) {
    //             // if (to.name == 'login') {
    //             //     console.log("进入coupon权限不足");
    //             //     // next('/login');
    //             // } else {
    //                 console.log('权限不足')
    //             // }
    //             return;
    //         }
    //     }
    // }
    next();
})

export default router