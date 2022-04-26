<template>
    <view>
        <view class="logo">长和家居</view>
        <a-form
            class="login-form"
        >
            <a-form-item
                label="Username"
                name="username"
                :rules="[{ required: true, message: 'Please input your username!' }]"
            >
                <a-input v-model="formState.value" placeholder="Basic usage" />
            </a-form-item>
        </a-form>
    </view>
</template>

<script>
export default {
    name: "login",
    data(){
        return {
            formState: ''
        }
    },
}
</script>

<style scoped>

</style>
