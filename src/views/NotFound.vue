<template>
    <div class="not-found">
        <h2 class="brand">PAGE NOT FOUND</h2>
    </div>
</template>

<script>
    export default {
        name: "notFound"
    };
</script>

<style scoped>
    .not-found {
        display: flex;
        height: 100vh;
        width: 100vw;
        overflow-y: hidden;
        justify-content: center;
        align-items: center;
    }

    .brand {
        margin: 0;
        font-size: 5rem;
        text-align: center;
        font-weight: normal;
        color: #fafafa;
    }


    @media screen and (max-width: 480px) {
        .brand {
            font-size: 3rem;
        }
    }
</style>