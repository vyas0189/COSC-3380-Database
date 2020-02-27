const app = require('./config/app');

//port not defined, going to listen to port localhost 4000
const PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.info(`URL: http://localhost:${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});
