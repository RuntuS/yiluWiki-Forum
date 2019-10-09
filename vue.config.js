const Require = require("./mock/index.json");
// let data = {
//     ypContent : "Hello World!"
// };
module.exports = {
    lintOnSave: true,
    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        },
        externals: {
            'axios': 'axios',
            'hljs': 'hljs',
            'vue': 'Vue',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter'
        }
    },

    devServer: {
        port: 8080,
        before(app) {
            app.get(/pages\/\d+/, (req, res) => {
                res.json(Require);
            });
        }
    }
};