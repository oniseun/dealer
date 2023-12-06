const app = require('./app');

init();

async function init() {
  try {
    app.listen(3001, () => {
      console.warn(`Express App Listening on Port 3001`);
      console.warn('=========================================================================\n')
      console.warn('Swagger API Docs: http://localhost:3001/api-docs\n')
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
