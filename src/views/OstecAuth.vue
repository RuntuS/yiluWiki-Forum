<!--suppress ALL -->
<!-- www.xsix103.cn 签到以及实习系统的临时认证跳板-->
<template>
    <div></div>
</template>

<script>
    export default {
        name: 'OstecAuth',
        created() {
            const ticket = this.$route.query.ticket;
            if (ticket == null || ticket === '')
                document.location.href = `https://www.xsix103.cn/prac-manage/login`;
            else
                document.location.href = `https://www.xsix103.cn/prac-manage/ostecAuth?ticket=${ticket}`;

        }
    };
</script>

<style scoped>

</style>
