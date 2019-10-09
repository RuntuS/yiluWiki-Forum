<template>
    <div class="pg">
        <div class="markdown" v-html="htmlContent" v-highlight></div>
    </div>
</template>

<script>
    import showdown from 'showdown';

    export default {
        name: "page",
        props: {
            ypId: String
        },
        created() {
            const ypId = parseInt(this.ypId);
            this.$request
                .get(`/pages/${ypId}`)
                .then(res => {
                    const converter = new showdown.Converter();
                    this.htmlContent = converter.makeHtml(res.data.ypContent);
                })
                .catch(err => {
                    console.log(err);
            });
        },
        data() {
            return {
                htmlContent: null
            };
        }
    };
</script>

<style scoped>
    .pg {
        width: 55%;
        margin: auto;
        padding-bottom: 10%;
    }

    @media screen and (max-width: 1366px) {
        .pg {
            width: 70%;
            margin: auto;
        }
    }

    @media screen and (max-width: 1024px) {
        .pg {
            width: 80%;
            margin: auto;
        }
    }

    @media screen and (max-width: 480px) {
        .pg {
            width: 95%;
            margin: auto;
        }
    }
</style>