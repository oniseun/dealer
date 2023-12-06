const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const contractRoutes = require('./routes/contractRoutes');
const jobRoutes = require('./routes/jobRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { models, sequelize  } = require('../src/models');
const app = express();
app.use(express.json({limit: '20mb'}));
app.use(helmet())
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST'],
    exposedHeaders: ['Authorization', 'Content-Type', 'X-Entity', 'X-Browser-Token']
  }))
morgan.token('payload', (req) => `${JSON.stringify(req.params)} - ${JSON.stringify(req.query)}`)
const logger = morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":payload"')
app.use(logger)
app.set('sequelize', sequelize);
app.set('models', models);

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'DEEL BACKEND TASK',
        version: '1.0.0',
        description: 'API documentation for DEEL BACKEND TASK',
      },
    },
    apis: ['./src/routes/*.js'], // Path to the files containing Swagger annotations
  };
  
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/contracts', contractRoutes);
app.use('/jobs', jobRoutes);
app.use('/balances', balanceRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
