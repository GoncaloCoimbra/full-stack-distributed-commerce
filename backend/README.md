# Backend legado

Esta pasta contém a implementação backend antiga do workspace.

Este backend foi construído como uma loja e-commerce mono-loja com checkout resiliente à concorrência. Não se trata de uma arquitetura SaaS multi-tenant nem de uma plataforma “Shopify/WooCommerce”; é uma aplicação única com cache e integração Redis opcional para melhorar desempenho e confiabilidade.

Persistência:
- Prisma é o ORM primário para dados transacionais.
- Há código legado de modelos Mongoose/MongoDB presentes, que deve ser visto como dívida técnica a ser migrada para Prisma.

Para o trabalho atual, consultar:
- [Chatops/backend](../Chatops/backend)
- [logistica-multi-tenant/backend-nest](../logistica-multi-tenant/backend-nest)

O conteúdo aqui presente deve ser tratado como referência histórica ou compatibilidade local.