import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/swagger-ts'
import { pluginClient } from '@kubb/swagger-client'
import { pluginZod } from '@kubb/swagger-zod'

export default defineConfig({
  root: '.',
  input: {
    path: 'http://localhost:3000/api/docs-json',
  },
  output: {
    path: './src/api/generated',
    clean: true,
  },
  plugins: [
    pluginOas({
      validate: false,
    }),
    pluginTs({
      output: {
        path: 'types',
      },
    }),
    pluginClient({
      output: {
        path: 'clients',
      },
    }),
    pluginZod({
      output: {
        path: 'zod',
      },
    }),
  ],
})
