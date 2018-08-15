const express = require("express");
const morgan = require("morgan");

const blogPostRouter = require("./blogPostRouter");
const app = express();

app.use(morgan("common"));
app.use(express.json());


app.use("/blog-posts", blogPostRouter);

let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`Your app is listening on ${port}`);
            resolve(server);
        })
        .on('error', err => {

        });
    });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
    runServer().catch(err => console.log(err));
};

module.exports = { app, runServer, closeServer };
