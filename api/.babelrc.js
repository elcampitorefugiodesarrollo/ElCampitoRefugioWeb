module.exports = {
  parserOpts: { allowReturnOutsideFunction: true },
  presets: [
    ["@babel/env", {
      "targets": {
        "node": "18"
      },
      "loose": true
    }]
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src'],
        alias: {
          "src": "./src"
        },
      },
    ],
  ]
};