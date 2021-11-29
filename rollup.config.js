import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

export default {
  input: ["src/index.js"],
  output: {
    dir: "dist/",
    format: "cjs",
    exports: "default",
    chunkFileNames: "[name].js",
    manualChunks(id) {
      if (id.includes("node_modules")) {
        return "vendor";
      }
    },
  },
  plugins: [
    resolve({ preferBuiltins: true }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    commonjs(),
    json(),
  ],
};
