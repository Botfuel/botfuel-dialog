module.exports = {
  babelrcRoots: [".", "./packages/*"],
  presets: [
    "@babel/preset-env"
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import"
  ],
  sourceType: "unambiguous"
};