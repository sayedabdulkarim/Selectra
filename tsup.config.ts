import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  sourcemap: true,
  minify: true,
  treeshake: true,
  splitting: false,
  injectStyle: false,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    }
  },
  onSuccess: 'cp src/styles/selectra.css dist/styles.css',
})
