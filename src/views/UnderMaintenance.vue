<template>
    <div class="under-maintenance">
        <h2 class="brand">Under Maintenance</h2>
    </div>
</template>

<script>
    export default {
        name: "UnderMaintenance"
    };
</script>

<style scoped>
    .under-maintenance {
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