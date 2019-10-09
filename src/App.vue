<template>
    <div id="app">
        <navigation/>
        <router-view/>
    </div>
</template>

<script>
    import navigation from '@/components/Navigation.vue';

    export default {
        name: 'app',
        components: {navigation}
    };
</script>

<style>
    html {
        background-color: #0d0d0d;
        font-family: Roboto, -apple-system, BlinkMacSystemFont,
        "Segoe UI", Helvetica, Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    body {
        margin: 0;
        overflow: auto;
        height: 100%;
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
    }

    .markdown {
        margin-top: 100px;
        color: #fafafa;
    }

    .markdown h1 {
        font-size: 3rem;
        font-weight: normal;
    }

    .markdown h2 {
        font-size: 2rem;
        font-weight: normal;
    }

    .markdown h3 {
        font-size: 1.8rem;
        font-weight: normal;
    }

    .markdown h4 {
        font-size: 1.5rem;
        font-weight: normal;
    }

    .markdown p {
        margin-left: 0.5rem;
    }

    .markdown img {
        max-width: 100%;
        max-height: 480px;
    }

    .markdown a {
        color: #fafafa;
    }

    .markdown pre {
        margin-left: 0.5rem;
        overflow-x: auto;
        overflow-y: hidden;
        max-width: 100%;
    }

    .markdown code {
        padding: 0.5rem;
    }

    .markdown pre code {
        padding: 1rem;
        border-radius: 5px;
    }

    @media screen and (max-width: 480px) {
        .markdown {
            margin-top: 80px;
        }

        .markdown h1 {
            font-size: 3rem;
            font-weight: normal;
        }

        .markdown h2 {
            font-size: 2.5rem;
            font-weight: normal;
        }

        .markdown h3 {
            font-size: 2rem;
            font-weight: normal;
        }

        .markdown h4 {
            font-size: 1.5rem;
            font-weight: normal;
        }

        .markdown p {
            margin-left: 0.2rem;
        }
    }
</style>
