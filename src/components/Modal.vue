<template>
    <transition name="modal-fade">
        <div class="modal-backdrop" @click="close">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <slot name="header"></slot>
                    <button class="btn-close" @click="close">x</button>
                </div>
                <div class="modal-body">
                    <slot name="body">
                        这是modal框的主体
                    </slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <button class="btn-green" @click="submit">提交</button>
                    </slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "Modal",
        props: ["title"],
        data() {
            return {};
        },
        methods: {
            close: function () {
                this.$emit("close");
            },
            submit: function () {
                this.$emit("submit");
            }
        }
    };
</script>

<style scoped>
    .modal-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        background-color: #fff;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        width: 600px;
    }

    .modal-header,
    .modal-footer {
        padding: 15px;
        display: flex;
    }

    .modal-header {
        border-bottom: 1px solid #eee;
        color: #4aae9b;
        justify-content: space-between;
    }

    .modal-footer {
        border-top: 1px solid #eee;
        justify-content: flex-end;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
    }

    .btn-close {
        border: none 0;
        font-size: 20px;
        padding: 15px;
        cursor: pointer;
        font-weight: bold;
        color: #4aae9b;
        background-color: transparent;
    }

    .btn-green {
        color: #fff;
        background-color: #4aae9b;
        border: 1px solid #4aae9b;
        border-radius: 5px;
        width: 80px;
        height: 30px;
    }

    .modal-fade-enter,
    .modal-fade-leave-active {
        opacity: 0;
    }

    .modal-fade-enter-active,
    .modal-fade-leave-active {
        transition: opacity 0.5s ease;
    }
</style>
