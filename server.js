'use strict';

const express = require("express");
const morgan = require("morgan");
const mongoose = require('mongoose');
const blogPostRouter = require('./blogPostRouter');
const authorRouter = require('./authorRouter');
const { PORT, DATABASE_URL } = require('./config');
const app = express();

app.use(morgan("common"));
app.use(express.json());
app.use('/blogs', blogPostRouter);
app.use('/authors', authorRouter);

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseUrl,
            err => {
                if (err) {
                    return reject(err);
                }
                server = app
                    .listen(port, () => {
                        console.log(`Your app is listening on port ${port}`);
                        resolve();
                    })
                    .on('error', err => {
                        mongoose.disconnect();
                        reject(err);
                    });
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.log(err));
};

module.exports = { app, runServer, closeServer };
