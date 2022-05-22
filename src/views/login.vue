<template>
    <div class="containter loginContain">
        <div style="width: 20%">
            <div class="logo">长和家居</div>
            <div class="loginForm">
                <a-form :model="formState" name="basic" autocomplete="off">
                    <a-form-item :rules="[{ required: true, message: '请输入手机号或用户名' }]">
                        <a-input v-model="formState.userAccount" placeholder="请输入手机号或用户名"/>
                    </a-form-item>
                    <a-form-item :rules="[{ required: true, message: 'Please input your password!' }]">
                        <a-input-password v-model="formState.pwdMd5" placeholder="请输入密码"/>
                    </a-form-item>
                    <a-button @click="login" type="primary" shape="round" size="large" style="width: 100%">
                        登录
                    </a-button>
                </a-form>
            </div>
        </div>
    </div>
</template>
<script>
    import api from "@/service/api";
    import {getToken} from "@/utils/auth";
    import md5 from 'js-md5'
    import axios from "axios";

    export default {
        name: "login",
        data() {
            return {
                formState: {}
            };
        },
        methods: {
            //登录
            async login() {
                // this.formState.pwdMd5 = md5(this.formState.pwdMd5)
                let res = await api.managerLogin(this.formState)
                if (res.errorCode == 0) {
                    localStorage.setItem("token", res.data.token)

                    this.$router.push({path: '/center/management'});
                    setTimeout(() => {
                        window.location.reload()
                    }, 100)

                } else {
                    this.$message.error(res.msg);
                }
            },
        },
        mounted() {

        },

    };
</script>
<style lang="scss" scoped>
    .loginContain {
        display: flex;
        justify-content: center;
        //align-items: center;
        text-align: center;
        margin-top: 10%;
        position: relative;

        .loginForm {
            margin-top: 20px;
        }
    }
</style>
