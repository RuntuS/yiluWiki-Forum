<template>
    <div class="forum">
        <h1 class="forum-brand">Welcome to YILU Forum!</h1>
        <div class="content">
            <div class="posts">
                <ul>
                    <li class="post" v-for="item in posts" :key="item.yfpId">
                        <router-link :to="'/fpage/'+item.yfpId"><h2>{{ item.yfpTitle }}</h2></router-link>
                        <p>{{ item.yfpAbstract }}</p>
                        <p class="info">
                            <img :src="item.ywUser.yuAvatarUrl"><!--头像-->
                            <span class="user" @click="goGithub(item.ywUser)"> {{ item.ywUser.yuName }} </span>
                            <span class="datetime">最后活跃于 {{ item.yfpUpdateTime }}</span>
                            <span v-if="item.yuId == yuInfo.ywUser.yuId" style="float: right;"><!--判断是否为自己的号-->
                              <a class="delete" @click="deletePost(item.yfpId)">删除</a>
                            </span>
                        </p>
                    </li>
                </ul>
                <loading v-if="loading" style="height: 70px;"></loading>
            </div>
            <aside class="forum-aside">
                 <button v-if="!yuInfo" class="login" @click="doLogin()">Login with Github</button>
                <div class="yuInfo">
                    <img :src="this.yuInfo.ywUser.yuAvatarUrl">
                    <span>{{this.yuInfo.ywUser.yuName}}</span><!--头像展示处-->
                </div>
                <button class="insert" @click="isVisible=true">+ 点此发布帖子</button>
                <modal v-show="isVisible" @close="isVisible=false" @submit="insertPost">
                    <template slot="header">
                        <h3>发布帖子</h3>
                    </template>
                    <template slot="body">
                        <div class="errors" v-if="errors.length">
                            <b>请修改以下错误:</b>
                            <ul>
                                <li v-for="error in errors" :key="error">{{ error }}</li>
                            </ul>
                        </div>
                        <input class="titleInput" v-model="title" placeholder="请输入标题...">
                        <div id="editor"></div>
                    </template>
                </modal>
            </aside>
        </div>
    </div>
</template>

<script>
    import Modal from "../components/Modal.vue";
    import Loading from "../components/Loading.vue";

    import E from "wangeditor";

    export default {
        name: "forum",
        components: {
            Modal,
            Loading
        },
        data() {
            return {
                clientId: "6f6caa3910db2c0b8284",
                redirectURI: "http://www.yilustudio.cn/github_callback/",
                scopes: "user",
                state: "yilu-studio",
                page: 1,
                pageSize: 8,
                posts: [
                    {
                        yuId : 123,
                        yfpId :"123",
                        yfpTitle :"有点骚",
                        ywUser : {
                            yuName : "兰翰麟",
                            yuAvatarUrl :"112.121.121.111",//头像链接
                            yuHtmlUrl : "https://github.com/RuntuS"
                        },
                        yfpUpdateTime : "2019.10.01",
                        yfpAbstract : "这是啥!"
                    }
                ],
                yuInfo: {
                    ywUser : {
                        yuName: "兰翰麟!",
                        yuAvatarUrl : "112.121.121.111",//头像链接
                        YuId : 123,
                        yuHtmlUrl : "https://github.com/RuntuS"
                    },

                },
                isVisible: false,
                editor: "",
                title: "",
                errors: [],
                loading: false,
                lastTime: null,
                pageAmount: null
            };
        },
        methods: {
            doLogin() {
                window.location.href = `https://github.com/login/oauth/authorize?client_id=${
                    this.clientId
                }&redirect_uri=${this.redirectURI}&scope=${this.scopes}&state=${
                    this.state
                }`;
            },
            getposts() {
                this.loading = true;
                // debugger
                this.$request
                    .get(`/posts?page=${this.page}&pageSize=${this.pageSize}`, {
                        headers: {
                            Authorization: this.yuInfo.accessToken//带着token进行访问
                        }
                    })
                    .then(response => {
                        const posts = response.data.list;
                        debugger
                        posts.forEach(item => {
                            item.yfpUpdateTime = this.dateTrans(item.yfpUpdateTime);
                        });
                        this.posts = this.posts.concat(posts);
                        // debugger
                        this.pageAmount = response.data.pages;
                    })
                    .catch(error => {
                        debugger
                        console.log(error);
                        
                        alert("加载帖子失败,请稍后再试...");
                    })
                    .finally(() => {
                        debugger
                        this.loading = false;
                });
            },
            insertPost() {
                this.errors = [];
                if (
                    this.editor.txt.text().length < 10 ||
                    this.editor.txt.text().length > 800
                )
                    this.errors.push("文本内容(含符号)须在10-800个字符之间");
                if (this.title.length < 5 || this.title.length > 60)
                    this.errors.push("帖子标题(含字符)须在5-60个字符之间");
                if (this.errors.length) return;
                const data = {
                    yfpContent: this.editor.txt.html(),
                    yfpTitle: this.title,
                    yfpAbstract:
                        this.editor.txt.text().length > 40
                            ? this.editor.txt.text().slice(0, 40) + "..."
                            : this.editor.txt.text()
                };
                this.$request({
                    method: "post",
                    url: `/posts`,
                    data: data,
                    headers: {
                        Authorization: this.yuInfo.accessToken
                    }
                })
                    .then(() => {
                        alert("发布成功");
                        this.isVisible = false;
                        this.page = 1;
                        this.posts = [];
                        this.editor.txt.clear();
                        this.getposts();
                    })
                    .catch(function (err) {
                        console.log(err);
                        alert("提交失败，请稍后再试");
                });
            },
            deletePost(yfpId) {
                const con = confirm("确定删除此帖子吗，删除后将无法恢复?");
                if (con === true) {
                    this.$request({
                        method: "delete",
                        url: `/posts/${yfpId}`,
                        headers: {
                            Authorization: this.yuInfo.accessToken
                        }
                    })
                        .then(() => {
                            alert("删除成功");
                            this.posts = [];
                            this.getposts();
                        })
                        .catch(err => {
                            console.log(err);
                            alert("删除失败，请稍后再试");
                    });
                }
            },
            createEditor() {
                const editor = new E("#editor");
                if (document.body.clientWidth < 1000) {
                    editor.customConfig.menus = [
                        "emoticon" // 表情
                    ];
                } else {
                    editor.customConfig.menus = [
                        "bold", // 粗体
                        "fontSize", // 字号
                        "italic", // 斜体
                        "underline", // 下划线
                        "strikeThrough", // 删除线
                        "link", // 插入链接
                        "list", // 列表
                        "justify", // 对齐方式
                        "quote", // 引用
                        "emoticon", // 表情
                        "image", // 插入图片
                        "table", // 表格
                        "code", // 插入代码
                        "undo" // 撤销
                    ];
                }
                this.editor = editor;
                editor.create();
            },
            // 节流
            throttle(fn, gapTime) {
                let nowTime = new Date();
                if (nowTime - this.lastTime > gapTime || !this.lastTime) {
                    fn();
                    this.lastTime = nowTime;
                }
            },
            goGithub(ywUser) {
                document.location.href = ywUser.yuHtmlUrl;
            }
        },
        created() {

            /*if (localStorage.getItem("yuInfo") == null) {
                alert("请先使用Github账号登录");
                this.doLogin();
            }*/
            debugger;
            // this.yuInfo = JSON.parse(localStorage.getItem("yuInfo")); // 后期待补充 校验

        },

        mounted() {
            this.getposts();
            debugger
            this.createEditor();
            window.onscroll = () => {
                const scrollTop = document.documentElement.scrollTop; //距离顶部的距离
                const windowHeight = document.documentElement.clientHeight; //浏览器的高度
                const scrollHeight = document.documentElement.scrollHeight; ////总高度
                if (scrollTop + windowHeight === scrollHeight) {
                    let scrollUp = () => {
                        if (this.page === this.pageAmount) {
                            alert("已无更多帖子");
                            window.onscroll = "destroy";
                            return;
                        }
                        this.page++;
                        this.getposts();
                    };
                    this.throttle(scrollUp, 2000);
                }
            };
        }
    };
</script>

<style scoped>
    li {
        list-style: none;
    }

    a {
        text-decoration: none;
        color: white;
    }

    a:hover {
        text-decoration: underline;
        cursor: pointer;
        font-weight: bold;
    }

    .forum-brand {
        padding-left: 40px;
    }

    .forum {
        color: white;
        margin: 0 auto;
        margin-top: 100px;
        width: 70%;
    }

    .content {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .posts {
        width: 75%;
        height: 300px;
    }

    .post {
        border: 1px solid white;
        padding: 0 15px 0 15px;
        width: 90%;
        margin: 5px 5px 10px 5px;
    }

    .post:hover {
        box-shadow: white 1px 1px 7px;
    }

    .post .info {
        color: #839192;
    }

    .post img {
        vertical-align: middle;
        width: 20px;
        height: auto;
    }

    .post .user {
        margin: 0 10px 0 0;
    }

    .post .user:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    .post .datetime {
        margin: 0 0 0 10px;
    }

    aside {
        width: 25%;
        height: 300px;
        margin-top: 14px;
    }

    .login {
        width: 90%;
        height: 60px;
        border-radius: 5px;
        color: white;
        background-color: #2471a3;
        font-size: 14px;
    }

    .login:hover {
        cursor: pointer;
    }

    .yuInfo {
        width: 80%;
        background-color: transparent;
        border: white 1px solid;
        padding: 15px 20px 15px 20px;
    }

    .yuInfo > img {
        vertical-align: middle;
        width: 30px;
        height: auto;
    }

    .yuInfo > span {
        margin-left: 10px;
        display: inline-block;
    }

    .insert {
        margin-top: 30px;
        width: 90%;
        height: 60px;
        background-color: transparent;
        border: white 1px solid;
        color: white;
    }

    .insert:hover,
    .insert:focus {
        cursor: pointer;
        box-shadow: white 1px 1px 7px;
        text-shadow: white 0 1px 7px;
    }

    #editor {
        color: black;
    }

    .titleInput {
        border: 1px solid #ccc;
        padding: 7px 10px 7px 10px;
        border-radius: 3px;
        margin-bottom: 10px;
        width: 560px;
        font-size: 16px;
    }

    .errors {
        background-color: #ec7063;
        padding: 5px 10px 5px 10px;
        border-radius: 10px;
    }

    .delete {
        color: #ec7063;
    }

    @media screen and (max-width: 768px) {
        .forum {
            color: white;
            margin: 100px 0 0 20px;
            width: 80%;
        }

        .forum-brand {
            padding-left: 20px;
        }

        .content {
            justify-content: left;
        }

        .yuInfo {
            display: none;
        }

        .posts {
            width: 100%;
        }

        .posts ul {
            margin: 0;
            padding: 0;
        }

        .posts li {
            width: 100%;
            margin: 0 0 1rem 0;
            padding: 0 1rem 0 1rem;
        }

        .forum-aside {
            position: fixed;
            top: 60px;
            right: -10px;
        }

        .insert {
            background-color: #000000;
        }
    }
</style>
