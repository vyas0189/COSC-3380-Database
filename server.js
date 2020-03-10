const app = require('./config/app');

const { PORT = 4000, NODE_ENV } = process.env;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.info(`URL: http://localhost:${PORT}`);
  console.log(`NODE_ENV: ${NODE_ENV}`);
});
