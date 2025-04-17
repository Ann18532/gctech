const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Unify ERP API',
      version: '1.0.0',
      description: 'Universal ERP API documentation'
    }
  },
  apis: ['./src/**/*.js'] // 👈 Use JSDoc-style comments
};

const swaggerSpec = swaggerJSDoc(options);

function setupDocs(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupDocs;
