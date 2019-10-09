<template>
    <div class="fpage">
        <div class="post">
            <h2>{{post.yfpTitle}}</h2>
            <div v-html="post.yfpContent"></div>
            <p class="info" v-if="post.ywUser">
                <img :src="post.ywUser.yuAvatarUrl">
                <span class="post-user" @click="goGithub(post.ywUser)"> {{ post.ywUser.yuName }}</span>
                <span>最后编辑于 {{post.yfpUpdateTime}}</span>
                <span style="float: right;">
              <span v-if="post.yuId==yuInfo.ywUser.yuId"><!--如果是贴主 可以修改内容和回复-->
                <a class="edit" @click="isVisible=true;mTitle='修改内容';editor.txt.html(post.yfpContent);submitStatus=2;">编辑</a>
                <span>/</span>
              </span>
              <a class="oreply" @click="isVisible=true;mTitle='回帖';editor.txt.clear();submitStatus=1;">回复本贴</a>
            </span>
            </p>
        </div>
        <div class="replies">
            <h3 v-if="this.replies.length === 0">本帖暂无回复, 去逛逛其他帖子吧</h3>
            <ul>
                <li class="reply" v-for="item in replies" :key="item.yfrId">
                    <p v-html="item.yfrContent"></p>
                    <p class="info">
                        <img :src="item.ywUser.yuAvatarUrl">
                        <span class="user" @click="goGithub(item.ywUser)"> {{ item.ywUser.yuName }} </span>
                        <span> {{ item.yfrFloor }} 楼<span
                                v-show="item.yfrReplyTo"> ( 回复{{item.yfrReplyTo}}楼 ) </span> </span>
                        <span class="datetime">最后编辑于 {{ item.yfrUpdateTime }}</span>
                        <span style="float: right;">
                      <span v-if="item.yuId === yuInfo.ywUser.yuId">
                        <a class="edit"
                           @click="isVisible=true;mTitle='修改内容';operateId=item.yfrId;editor.txt.html(item.yfrContent);submitStatus=3">编辑</a>
                        <span>/</span>
                        <a class="delete" @click="delReply(item.yfrId)">删除</a>
                        <span>/</span>
                      </span>
                      <a class="oreply"
                         @click="isVisible=true;operateId=item.yfrId;mTitle='回复';editor.txt.clear();submitStatus=1;">回复本层</a>
                    </span>
                    </p>
                </li>
            </ul>
            <span class="pageChange" v-show="page > 1" @click="prePage">&lt; 上一页</span>
            <span style="margin-left: 40%;">第 {{page}} 页</span>
            <span class="pageChange"
                  v-show="page < pageAmount"
                  @click="nextPage"
                  style="float: right;">下一页 &gt;</span>
        </div>
        <modal v-show="isVisible" @close="closeEditor" @submit="submit()">
            <template slot="header">
                <h3>{{mTitle}}</h3>
            </template>
            <template slot="body">
                <div class="errors" v-if="errors.length">
                    <b>请修改以下错误:</b>
                    <ul>
                        <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                </div>
                <div id="editor"></div>
            </template>
        </modal>
    </div>
</template>

<script>
    import E from "wangeditor";
    import Modal from "../components/Modal.vue";

    export default {
        name: "fpage",
        components: {
            Modal
        },
        props: {
            yfpId: String
        },
        data() {
            return {
                post: {},
                replies: [],
                editor: String,
                yuInfo: null,
                page: 1,
                pageSize: 6,
                isVisible: false,
                errors: [],
                operateId: 0,
                mTitle: "",
                submitStatus: 0,
                pageAmount: ""
            };
        },
        methods: {
            getPost() {
                this.$request
                    .get(`/posts/${this.yfpId}`, {
                        headers: {
                            Authorization: this.yuInfo.accessToken
                        }
                    })
                    .then(response => {
                        const post = response.data;
                        post.yfpUpdateTime = this.dateTrans(post.yfpUpdateTime);
                        this.post = post;
                    })
                    .catch(function (error) {
                        console.log(error);
                        alert("加载帖子失败,请稍后再试...");
                });
            },
            getReplies() {
                this.$request
                    .get(
                        `/posts/${this.yfpId}/replies?page=${this.page}&pageSize=${
                            this.pageSize
                        }`,
                        {
                            headers: {
                                Authorization: this.yuInfo.accessToken
                            }
                        }
                    )
                    .then(response => {
                        const replies = response.data.list;
                        replies.forEach(item => {
                            item.yfrUpdateTime = this.dateTrans(item.yfrUpdateTime);

                            function getReplyFloor() {
                                let floor = 0;
                                replies.forEach(subitem => {
                                    if (subitem.yfrId === item.yfrReplyTo) {
                                        floor = subitem.yfrFloor;
                                        return;
                                    }
                                });
                                return floor;
                            }

                            if (item.yfrReplyTo) {
                                item.yfrReplyTo = getReplyFloor();
                            }
                        });
                        this.replies = replies;
                        this.pageAmount = response.data.pages;
                    })
                    .catch(err => {
                        console.log(err);
                        alert("获取评论失败，请稍后再试...");
                });
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
            submit() {
                switch (this.submitStatus) {
                case 1:
                    this.insertReply();
                    break;
                case 2:
                    this.putPost();
                    break;
                case 3:
                    this.putReply();
                    break;
                default:
                    alert("有误");
                }
            },
            insertReply() {
                if (
                    this.editor.txt.text().length < 5 ||
                    this.editor.txt.text().length > 200
                ) {
                    this.errors.push("文本内容(含符号)须在5-200个字符之间");
                    return;
                }
                const data = this.operateId
                    ? {
                        yfrContent: this.editor.txt.html(),
                        yfrReplyTo: this.operateId
                    }
                    : {
                        yfrContent: this.editor.txt.html()
                };
                this.operateId = 0;
                this.$request({
                    method: "post",
                    url: `/posts/${this.yfpId}/replies`,
                    data: data,
                    headers: {
                        Authorization: this.yuInfo.accessToken
                    }
                })
                    .then(() => {
                        alert("发布成功");
                        this.isVisible = false;
                        this.page = 1;
                        this.getReplies();
                    })
                    .catch(function (err) {
                        console.log(err);
                        alert("提交失败，请稍后再试");
                });
            },
            putPost() {
                if (
                    this.editor.txt.text().length < 10 ||
                    this.editor.txt.text().length > 800
                ) {
                    this.errors.push("文本内容(含符号)须在10-800个字符之间");
                    return;
                }
                const data = {
                    yfpContent: this.editor.txt.html(),
                    yfpAbstract:
                        this.editor.txt.text().length > 40
                            ? this.editor.txt.text().slice(0, 40) + "..."
                            : this.editor.txt.text(),
                    yfpTitle: this.post.yfpTitle
                };
                this.$request({
                    method: "put",
                    url: `/posts/${this.yfpId}`,
                    data: data,
                    headers: {
                        Authorization: this.yuInfo.accessToken
                    }
                })
                    .then(() => {
                        alert("修改成功");
                        this.isVisible = false;
                        this.getPost();
                    })
                    .catch(function (err) {
                        console.log(err);
                        alert("修改失败，请稍后再试");
                });
            },
            putReply() {
                if (
                    this.editor.txt.text().length < 5 ||
                    this.editor.txt.text().length > 200
                ) {
                    this.errors.push("文本内容(含符号)须在5-200个字符之间");
                    return;
                }
                const yfrId = this.operateId;
                this.operateId = 0;
                const data = {
                    yfrContent: this.editor.txt.html()
                };
                this.$request({
                    method: "put",
                    url: `/posts/${this.yfpId}/replies/${yfrId}`,
                    data: data,
                    headers: {
                        Authorization: this.yuInfo.accessToken
                    }
                })
                    .then(() => {
                        alert("修改成功");
                        this.isVisible = false;
                        this.getReplies();
                    })
                    .catch(function (err) {
                        console.log(err);
                        alert("修改失败，请稍后再试");
                });
            },
            delReply(yfrId) {
                const con = confirm("确定删除此回复吗，删除后将无法恢复?");
                if (con === true) {
                    this.$request({
                        method: "delete",
                        url: `/posts/${this.yfpId}/replies/${yfrId}`,
                        headers: {
                            Authorization: this.yuInfo.accessToken
                        }
                    })
                        .then(() => {
                            alert("删除成功");
                            this.getReplies();
                        })
                        .catch(err => {
                            console.log(err);
                            alert("删除失败，请稍后再试");
                    });
                }
            },
            prePage() {
                if (this.page === 1) {
                    alert("已是首页");
                    return;
                }
                this.page--;
                this.getReplies();
            },
            nextPage() {
                if (this.page === this.pageAmount) {
                    alert("已经是末页");
                    return;
                }
                this.page++;
                this.getReplies();
            },
            goGithub(ywUser) {
                document.location.href = ywUser.yuHtmlUrl;
            },
            closeEditor() {
                const con = confirm("确认离开？系统不会保存您的更改");
                if (con) {
                    this.isVisible = false;
                }
            }
        },
        created() {
            if (localStorage.getItem("yuInfo") == null) {
                alert("请先使用Github账号登录");
                this.doLogin();//这里还没有实现
            }
            this.yuInfo = JSON.parse(localStorage.getItem("yuInfo")); // 后期待补充 校验
        },
        mounted() {
            this.createEditor();
            this.getPost();
            this.getReplies();
        }
    };
</script>

<style scoped>
    a {
        color: white;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
        cursor: pointer;
        font-weight: bold;
    }

    ul {
        padding: 0;
    }

    li {
        list-style: none;
    }

    .fpage {
        margin: 0 auto;
        margin-top: 100px;
        width: 70%;
        color: white;
    }

    .fpage a {
        color: #fafafa;
    }

    .post {
        width: 100%;
        border: 1px solid white;
        padding: 0 20px 0 20px;
    }

    .post-user {
        margin-right: 10px;
    }

    .post-user:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    .info {
        color: #839192;
    }

    .info > img {
        vertical-align: middle;
        width: 20px;
        height: auto;
    }

    .replies {
        width: 100%;
        border: 1px solid white;
        margin-top: 20px;
        padding: 20px;
    }

    .reply {
        border-bottom: 1px dashed white;
    }

    .reply .user {
        margin: 0 10px 0 0;
    }

    .reply .user:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    .reply .datetime {
        margin: 0 0 0 10px;
    }

    .insert {
        margin-top: 30px;
        height: 50px;
        width: 200px;
        border-radius: 10px;
    }

    .errors {
        background-color: #ec7063;
        padding: 5px 10px 5px 10px;
        border-radius: 10px;
    }

    #editor {
        color: black;
    }

    .pageChange {
        cursor: pointer;
    }

    .delete {
        color: #ec7063;
    }

    .edit {
        color: #f1c40f;
    }

    .oreply {
        color: #28b463;
    }

    @media screen and (max-width: 1000px) {
        .fpage {
            margin: 100px 20px 20px 20px;
            width: 80%;
            color: white;
        }
    }
</style>