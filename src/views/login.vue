<template>
    <div>
        <div class="logo">长和家居</div>
        <div>
            <a-form
                :model="formState"
                name="basic"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
            >
                <a-form-item
                    label="Username"
                    name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]"
                >
                    <a-input v-model="formState.username"/>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script>
    import api from "@/service/api";
    import {getToken} from "@/utils/auth";

    export default {
        name: "login",
        data() {
            return {
                formState: {}
            };
        },
        methods: {
            //登录

        },
        mounted() {

        },

    };
</script>
<style lang="scss" scoped>

</style>
