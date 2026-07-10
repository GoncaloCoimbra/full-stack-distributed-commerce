import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tranzor Enterprise API',
      version: '2.1.0',
      description: 'Interactive API documentation for enterprise integrations, feeds, and tenant operations.',
    },
  },
  apis: ['server/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
