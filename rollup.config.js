import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  plugins: [
    nodeResolve(),
    commonjs()
  ]
};
