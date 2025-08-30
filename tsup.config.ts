import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true, // generate .d.ts types
  sourcemap: true,
  clean: true,
});
