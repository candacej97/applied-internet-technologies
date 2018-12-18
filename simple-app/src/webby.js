// webby.js
const NET_MODULE = require('net');
const FS_MODULE = require('fs');
const PATH = require('path');
const URL = require('url');

const HTTP_STATUS_CODES = {
    200: "OK",
    404: "Not Found",
    500: "Internal Server Error"
};

const MIME_TYPES = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    html: "text/html",
    css: "text/css",
    txt: "text/plain",
};

/**
 * @param {*} fileName 
 * @returns the extension of the file in lowercase as a String
 */
function getExtension(fileName) {
    const ext = PATH.extname(fileName);
    const expanded = ext.split('');
    delete expanded[0];

    return expanded.join('');
}

/**
 * @param {*} fileName 
 * @returns the MIME type of a file based on its extension
 */
function getMIMEType(fileName) {
    const EXT = getExtension(fileName);
    if (EXT === '') {return '';}
    return MIME_TYPES[EXT];
}

class Request {
    constructor(httpRequest) {
        const [METHOD, PATH, ...NOT_USED] = httpRequest.toString().split(' ');
        this.method = METHOD;
        this.path = PATH;
    }
}

class Response {
    constructor(socket, statusCode, version) {
        this.sock = socket;
        this.version = version ? version : "HTTP/1.1";
        this.statusCode = statusCode ? parseInt(statusCode) : 200;
        this.headers = {};
        this.body;
    }

    /**
     * Adds a new header name and value pair to the internal header property
     * @param {*} name 
     * @param {*} value 
     */
    set(name, value) {
        this.headers[name] = value;
    }

    /**
     * Closes the connection of the internal socket
     */
    end() {
        this.sock.end();
    }

    /**
     * @returns the first line of an http response based on the properties defined in this instance
     */
    statusLineToString() {
        const HTTP_STATUS_CODES = {
            200: "OK",
            404: "Not Found",
            500: "Internal Server Error"
        };
        return this.version + " " + this.statusCode + " " + HTTP_STATUS_CODES[this.statusCode] + "\r\n";
    }

    /**
     * @returns a String representation of the headers of this http response
     */
    headersToString() {
        let str = "";

        for (const key in this.headers) {
            if (this.headers.hasOwnProperty(key)) {
                str += key + ": " + this.headers[key] + "\r\n";
            }
        }

        return str;
    }

    /**
     * Sets the body property of this Response instance
     * @param {*} body 
     */
    send(body) {     

        this.headers["Content-Type"] = this.headers.hasOwnProperty("Content-Type") ? this.headers["Content-Type"] : "text/html";

        this.sock.write(this.version + " " + this.statusCode + " " + HTTP_STATUS_CODES[this.statusCode] + "\r\n");
        this.sock.write(this.headersToString());
        this.sock.write("\r\n");
        this.sock.write(body);
        
        this.body = body;
        
        this.sock.end();
        
    }

    /**
     * Sets the statusCode of the current instance.
     * @param {*} statusCode 
     * @returns this object
     */
    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }
}

class App {
    constructor() {
        this.routes = {};
        this.middleware = null;
        this.server = NET_MODULE.createServer(sock => this.handleConnection(sock));
    }

    /**
     * @param {*} path 
     * @returns returns a String, the normalized path
     */
    normalizePath(path) {
        const PARSED_PATH = URL.parse(path.toLowerCase(), true, true);
        const pathArr = PARSED_PATH.pathname.split('');

        if (pathArr[pathArr.length-1] === "/") {pathArr.pop();}
        return pathArr.join('');
    }

    /**
     * @param {*} method 
     * @param {*} path 
     * @returns a String, a property name suitable to uniquely identify a route in the routes property of an App object
     */
    createRouteKey(method, path) {
        return method.toUpperCase() + " " + this.normalizePath(path);
    }

    /**
     * @param {*} path 
     * @param {*} cb 
     * @returns NOTHING
     */
    get(path, cb) {
        const ROUTE = this.createRouteKey('GET', path);        
        this.routes[ROUTE] = cb;
    }

    /**
     * Sets this.middleware to call the param as a func with the middleware params
     * @param {*} cb 
     * @returns NOTHING
     */
    use(cb) {
        this.middleware = cb;
    }

    /**
     * Binds the server to the given params
     * @param {*} port 
     * @param {*} host 
     */
    listen(port, host) {
        this.server.listen(port, host);
    }

    /**
     * @param {*} sock 
     */
    handleConnection(sock) {
        sock.on('data', (binaryData) => {this.handleRequest(sock, binaryData);});
    }

    /**
     * 
     * @param {*} sock 
     * @param {*} binaryData 
     */
    handleRequest(sock, binaryData) {
        const req = new Request(binaryData.toString());
        const res = new Response(sock);

        if (this.middleware) {
            this.middleware(req, res, this.processRoutes(req, res));
        }
        else {
            this.processRoutes(req, res);
        }
    }

    processRoutes(req, res) {
        const func = this.routes[this.createRouteKey(req.method, req.path)];
        if (func) {
            func(req, res);
        }
        else {
            res.status(404);
            res.set("Content-Type", "text/plain");
            res.send("Page not found.");
        }
    }
    
}

/**
 * creates a middleware function… that will read a file based on a request path or call a next function to continue processing routes regularly
 * @param {*} basePath 
 * @returns new function
 */
function serveStatic(basePath) {
    const middlewareFunc = (req, res, next) => {
        const FULL_PATH = PATH.join(basePath, req.path);
        FS_MODULE.readFile(FULL_PATH, (err, data) => {
            if (err) {
                console.log(err);
                next(req, res);
            }
            else {
                res.set("Content-Type", getMIMEType(FULL_PATH));
                res.status(200);
                res.send(data);
            }
        });
    };

    return middlewareFunc;
}


module.exports = {
    HTTP_STATUS_CODES: HTTP_STATUS_CODES,
    MIME_TYPES: MIME_TYPES,
    getExtension: getExtension,
    getMIMEType: getMIMEType,
    Request: Request,
    App: App,
    Response: Response,
    static: serveStatic,
};