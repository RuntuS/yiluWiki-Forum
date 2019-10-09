module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-extra-parens': 2,
        'no-irregular-whitespace': 2,
        'no-unexpected-multiline': 2,
        'eqeqeq': [2, 'smart'],
        'computed-property-spacing': 2,
        'vue/script-indent': [2, 4, {'baseIndent': 1}],
        'semi': [2, 'always'],
        'no-var': 2,
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
