<template>
    <div class="it">
        <div class="markdown" v-html="htmlContent" v-highlight></div>
    </div>
</template>

<script>
    import showdown from 'showdown';

    export default {
        name: "intro",
        data() {
            return {
                itPageId: 3,
                htmlContent: '',
                timer: null,
                progress: 0
            };
        },
        created() {
            this.$request
                .get(`/pages/${this.itPageId}`)
                .then(res => {

                    const converter = new showdown.Converter();
                    // debugger
                    this.htmlContent = converter.makeHtml(res.data.ypContent);
                    // debugger

                })
                .catch(err => {
                    console.log(err);
            });
        }
    };
</script>

<style scoped>
    .it {
        width: 55%;
        margin: auto;
        padding-bottom: 10%;
    }

    @media screen and (max-width: 1366px) {
        .it {
            width: 70%;
            margin: auto;
        }
    }

    @media screen and (max-width: 1024px) {
        .it {
            width: 80%;
            margin: auto;
        }
    }

    @media screen and (max-width: 480px) {
        .it {
            width: 90%;
            margin: auto;
        }
    }
</style>