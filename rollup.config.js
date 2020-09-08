import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

export default {
  input: "js/index.js",
  output: {
    file: "dist/bundle.js",
    format: "umd",
  },
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
    commonjs({}),
  ],
  watch: {
    exclude: "node_modules/**",
  },
};
