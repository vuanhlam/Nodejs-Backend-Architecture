// The responsibility of server is define port and start server

const app = require("./src/app");

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with port ${PORT}`);
});

// process.on('SIGINT', () => {
//     server.close(() => {
//         console.log(`Exit Server Express`);
//     })
// })
