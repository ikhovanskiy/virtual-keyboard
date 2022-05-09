module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "airbnb-base/legacy",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "no-use-before-define": ["error", { "functions": false, "classes": true, "variables": true }],
        "no-restricted-syntax": [0]
    }
}
