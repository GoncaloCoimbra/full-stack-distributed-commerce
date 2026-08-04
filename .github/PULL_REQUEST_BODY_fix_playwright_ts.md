- Corrige erros de TypeScript (Cannot find name 'path'/'process'/'__dirname') em playwright.config.ts causados por falta de tipos Node no escopo do tsconfig.
- Adiciona "node" e "jest" a compilerOptions.types e inclui playwright.config.ts no tsconfig.json do backend.
- Substitui __dirname por process.cwd() e ajusta import de 'path' para import * as path, por robustez.
- Corrige tipagem de DATABASE_URL com fallback (process.env.DATABASE_URL ?? '').
- Validado localmente com `npx tsc --noEmit` sem erros.

Não inclui as correções anteriores de lint/timeout do E2E — abrir PR separado para isso, se ainda não estiver feito.
