import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/id-nfx.js',
  output: [
    { file: 'dist/id-nfx.umd.js', format: 'umd', name: 'NFXProvider' },
    { file: 'dist/id-nfx.esm.js', format: 'es' }
  ]
})