const app = require("express")();
// Loading env configuration from .env
require("dotenv").config();

app.use(require("body-parser").json());

const jsonwebtoken = require("jsonwebtoken");

app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});
var routes = require('./routes');
routes(app);

app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

port = process.env.PORT_NO || 5000;

app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});