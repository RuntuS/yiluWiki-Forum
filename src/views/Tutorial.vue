<!--suppress ALL -->
<template>
    <div class="ttr">
        <div class="markdown" v-html="htmlContent" v-highlight></div>
    </div>
</template>

<script>
    import showdown from 'showdown';

    export default {
        name: "tutorial",
        data() {
            return {
                ttrPageId: 1,
                htmlContent: '',
                timer: null,
                progress: 0
            };
        },
        created() {
            this.$request
                .get(`/pages/${this.ttrPageId}`)//挂载到本地服务器 所以采用/pages
                .then(res => {
                    const converter = new showdown.Converter();//创建markdown转换实例.
                    this.htmlContent = converter.makeHtml(res.data.ypContent);//进行转换
                })
                .catch(err => {
                    console.log(err);
            });
        }
    };
</script>

<style scoped>
    .ttr {
        width: 55%;
        margin: auto;
        padding-bottom: 10%;
    }

    @media screen and (max-width: 1366px) {
        .ttr {
            width: 70%;
            margin: auto;
        }
    }

    @media screen and (max-width: 1024px) {
        .ttr {
            width: 80%;
            margin: auto;
        }
    }

    @media screen and (max-width: 480px) {
        .ttr {
            width: 90%;
            margin: auto;
        }
    }
</style>
