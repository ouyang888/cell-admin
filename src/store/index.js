import Vue from 'vue'
import Vuex from 'vuex'
import { getToken } from '@/utils/auth';
import API from '../service/authorityApi'
import router from "@/router";

Vue.use(Vuex)
const token = getToken();

export default new Vuex.Store({
    state: {
        downloadVisible: false,//下载框
        authoriths: [],//权限
        /* 图片框start */
        isMouse: false,
        preX: 0,
        preY: 0,
        mouseX: 0,
        mouseY: 0,
        modalWidth: 50,
        previewImage: "",
        previewVisible: false
        /* 图片框end */
    },
    mutations: {
        cutDownloadVisible(state) {
            state.downloadVisible = !state.downloadVisible
        },
        mouseStart(state, envet) {
            state.isMouse = true
            state.preX = envet.x
            state.preY = envet.y
        },
        mouseIng(state, envet) {
            state.mouseX += envet.x - state.preX
            state.mouseY += envet.y - state.preY
            state.preX = envet.x
            state.preY = envet.y
        },
        afterClose(state) {
            state.isMouse = false
            state.previewImage = ''
        },
        mouseup(state) {
            state.isMouse = false
        },
        showImage(state, url) {
            state.previewImage = url
            state.previewVisible = true
        },
        setAuthoriths: (state, authoritys) => state.authoriths = authoritys,
        clearAuthoriths: (state) => state.authoriths = []
    },
    actions: {
        // setCityName({commit,state}, name){
        //     // 跟后台打交道
        //     // 调用mutaions里面的方法
        //     commit("setCity", name);
        // }
        mouseIng({ commit, state }, envet) {
            if (!state.isMouse) return
            commit("mouseIng", envet)
        },
        mouseStart({ commit }, envet) {
            console.log(envet, "envet");
            envet.preventDefault();
            envet.stopPropagation();
            commit("mouseStart", envet)
        },
        setUserAuthoritys: async ({ commit, state }) => {
            let userAuthoritys = state.authoriths;
            if (userAuthoritys.length===0) {
                try {
                    const { data,code } = await API.getSysUserInfo()
                // code: 1
                // data: null
                // msg: "该用户没有角色，请联系管理员"
                    if (code===100301) {
                        commit("clearAuthoriths")
                        router.replace('/login')
                    }
                    userAuthoritys = data ? data.list : []
                    commit("setAuthoriths", userAuthoritys)
                } catch (error) {
                    console.log(error);
                }
            }

            return userAuthoritys;
        }

    },
    getters: {
        getAuthoriths: state => state.authoriths,
    },
    // modules: {
    // }
})
