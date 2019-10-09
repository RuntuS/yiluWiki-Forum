<template>
    <div v-text="JSON.stringify(this.$route.query)">
    </div>
</template>

<script>
    export default {
        name: "githubCallback",
        data() {
            return {
                state: 'yilu-studio'
            };
        },
        created() {
            const code = this.$route.query.code;
            const state = this.$route.query.state;
            if (null == code || code.trim() === '')
                return;
            if (state !== this.state)
                return;
            this.$request
                .post(`/tokens/${code}`)
                .then((res) => {
                    const yuInfo = {
                        accessToken: 'Bearer ' + res.data.accessToken,
                        ywUser: res.data.ywUser,
                        createDate: new Date()
                    };
                    localStorage.setItem('yuInfo', JSON.stringify(yuInfo));
                    this.$router.push('/forum');
                })
                .catch((err) => {
                    console.log(err);
            });
        }
    };
</script>

<style scoped>

</style>