import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/MaskedInput.js",
  output: {
    file: "dist/MaskedInput.js",
    format: "umd",
    name: "vue-masked-input"
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    })
  ]
};
