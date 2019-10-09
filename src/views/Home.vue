<template>
    <div class="home">
        <h1 class="brand">YILU STUDIO</h1>
    </div>
</template>

<script>
    // @ is an alias to /src

    export default {
        name: 'home',
        components: {}
    };
</script>

<style scoped>
    .home {
        display: flex;
        height: 100vh;
        width: 100vw;
        justify-content: center;
        align-items: center;
    }

    .brand {
        margin: 0;
        font-size: 10rem;
        text-align: center;
        color: #fafafa;
    }

    @media screen and (max-width: 480px) {
        .brand {
            font-size: 4rem;
        }
    }
</style>
