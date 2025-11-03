//#region rolldown:runtime
var __create$2 = Object.create;
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$2 = Object.getOwnPropertyNames;
var __getProtoOf$2 = Object.getPrototypeOf;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames$2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps$2 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames$2(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp$2.call(to, key) && key !== except) __defProp$2(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc$2(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM$2 = (mod, isNodeMode, target) => (target = mod != null ? __create$2(__getProtoOf$2(mod)) : {}, __copyProps$2(isNodeMode || !mod || !mod.__esModule ? __defProp$2(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region ../../packages/dobs-http/dist/index.js
var require_dist$1 = /* @__PURE__ */ __commonJS({ "../../packages/dobs-http/dist/index.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var __create$1 = Object.create;
	var __defProp$1 = Object.defineProperty;
	var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames$1 = Object.getOwnPropertyNames;
	var __getProtoOf$1 = Object.getPrototypeOf;
	var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
	var __copyProps$1 = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames$1(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$1(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM$1 = (mod, isNodeMode, target) => (target = mod != null ? __create$1(__getProtoOf$1(mod)) : {}, __copyProps$1(isNodeMode || !mod || !mod.__esModule ? __defProp$1(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	let node_http = require("node:http");
	node_http = __toESM$1(node_http);
	let node_url = require("node:url");
	node_url = __toESM$1(node_url);
	let encodeurl = require("encodeurl");
	encodeurl = __toESM$1(encodeurl);
	let mime_types = require("mime-types");
	mime_types = __toESM$1(mime_types);
	let node_fs$1 = require("node:fs");
	node_fs$1 = __toESM$1(node_fs$1);
	let node_path$1 = require("node:path");
	node_path$1 = __toESM$1(node_path$1);
	function createRequest(req) {
		const request = req;
		const url = new node_url.URL(request.url, `http://${request.headers.host || "localhost"}`);
		const _body = req._body;
		request.pathname = url.pathname;
		request.href = url.href;
		request.search = url.searchParams;
		request.searchString = url.search;
		request.query = Object.fromEntries(url.searchParams);
		request.URL = url;
		request.rawBody = _body;
		return request;
	}
	function createResponse(res) {
		const response = res;
		response.status = (code) => {
			response.statusCode = code;
			return response;
		};
		response.message = (message) => {
			response.statusMessage = message;
			return response;
		};
		response.set = (field, value) => {
			if (typeof field === "string") response.setHeader(field, value);
			else Object.keys(field).forEach((header) => response.setHeader(header, field[header]));
			return this;
		};
		response.get = (field) => {
			return response.getHeader(field);
		};
		response.remove = (field) => {
			response.removeHeader(field);
			return response;
		};
		response.has = (field) => {
			return response.hasHeader(field);
		};
		response.redirect = (url) => {
			if (/^https?:\/\//i.test(url)) url = new node_url.URL(url).toString();
			response.set("Location", (0, encodeurl.default)(url));
			response.status(302);
			response.end();
			return response;
		};
		response.type = (type) => {
			const mimeType = (0, mime_types.contentType)(type);
			if (mimeType) response.set("Content-Type", mimeType);
			else response.remove("Content-Type");
			return response;
		};
		response.isWritable = () => {
			if (response.writableEnded || response.finished) return false;
			const socket = response.socket;
			if (!socket) return true;
			return socket.writable;
		};
		response.send = (data) => {
			let body;
			if (Buffer.isBuffer(data)) body = data;
			else if (typeof data === "string") body = data;
			else if (data === null || data === void 0) body = "";
			else if (typeof data === "object" || Array.isArray(data)) {
				response.type("json");
				body = JSON.stringify(data);
			} else if (typeof data === "number" || typeof data === "boolean") body = String(data);
			else body = String(data);
			if (!response.has("Content-Length")) response.set("Content-Length", Buffer.byteLength(body));
			response.end(body);
		};
		response.text = (data) => {
			response.type("text").send(data);
		};
		response.json = (data) => {
			response.type("json").send(JSON.stringify(data));
		};
		response.html = (data) => {
			response.type("html").send(data);
		};
		response.sendFile = (file) => {
			const stat = (0, node_fs$1.statSync)(file);
			response.status(200);
			response.type((0, node_path$1.extname)(file));
			response.set("Content-Length", stat.size);
			(0, node_fs$1.createReadStream)(file).pipe(response);
		};
		return response;
	}
	function getBody(req) {
		return new Promise((resolve, reject) => {
			let body = "";
			req.on("data", (chunk) => {
				body += chunk.toString();
			});
			req.on("end", () => resolve(body));
			req.on("error", reject);
		});
	}
	var BaseServer = class {
		middlewares;
		server;
		on;
		off;
		once;
		addListener;
		removeListener;
		removeAllListeners;
		emit;
		listeners;
		listenerCount;
		listen;
		constructor(cs = node_http.createServer) {
			this.middlewares = [];
			this.server = cs(this.handle.bind(this));
			this.on = this.server.on.bind(this.server);
			this.off = this.server.off.bind(this.server);
			this.once = this.server.once.bind(this.server);
			this.addListener = this.server.addListener.bind(this.server);
			this.removeListener = this.server.removeListener.bind(this.server);
			this.removeAllListeners = this.server.removeAllListeners.bind(this.server);
			this.emit = this.server.emit.bind(this.server);
			this.listeners = this.server.listeners.bind(this.server);
			this.listenerCount = this.server.listenerCount.bind(this.server);
			this.listen = this.server.listen.bind(this.server);
		}
		/**
		* append middlewares
		* ```ts
		* app.use(middleware);
		* ```
		* @param middlewares Middlewares
		*/
		use(...middlewares) {
			middlewares.forEach((middleware) => {
				if (typeof middleware !== "function") {} else this.middlewares.push(middleware);
			});
			return this;
		}
		handle(req, res) {
			if (this.middlewares.length === 0) {
				res.statusCode = 404;
				res.end();
			}
			let index = -1;
			const request = createRequest(req);
			const response = createResponse(res);
			const loop = async () => {
				if (index < this.middlewares.length && !res.writableEnded) {
					const middleware = this.middlewares[index += 1];
					if (middleware) {
						let called = false;
						const next = async () => {
							if (called) throw new Error("next() called multiple times");
							called = true;
							await loop();
						};
						await middleware(request, response, next);
					}
				}
			};
			getBody(req).then((body) => {
				request._body = body;
				loop();
			});
		}
	};
	function app(cs = node_http.createServer) {
		return new BaseServer(cs);
	}
	var src_default = app;
	exports.BaseServer = BaseServer;
	exports.createRequest = createRequest;
	exports.createResponse = createResponse;
	exports.default = src_default;
}) });

//#endregion
//#region ../../packages/dobs/dist/index.js
var require_dist = /* @__PURE__ */ __commonJS({ "../../packages/dobs/dist/index.js": ((exports) => {
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	let __dobsjs_http = require_dist$1();
	__dobsjs_http = __toESM(__dobsjs_http);
	let deepmerge_ts = require("deepmerge-ts");
	deepmerge_ts = __toESM(deepmerge_ts);
	let node_path = require("node:path");
	node_path = __toESM(node_path);
	let rolldown = require("rolldown");
	rolldown = __toESM(rolldown);
	let chokidar = require("chokidar");
	chokidar = __toESM(chokidar);
	let chalk = require("chalk");
	chalk = __toESM(chalk);
	let node_fs = require("node:fs");
	node_fs = __toESM(node_fs);
	let node_module = require("node:module");
	node_module = __toESM(node_module);
	const DEFAULT_CONFIG = {
		port: 8080,
		middlewares: [],
		createServer: void 0,
		cwd: process.cwd(),
		mode: "serve",
		temp: "./.dobs/"
	};
	const require$1 = (0, node_module.createRequire)(require("url").pathToFileURL(__filename).href);
	/**
	* Define route object.
	*
	* ```ts
	* export default defineRoutes({
	*    GET(req, res) { ... }
	* });
	* ```
	*
	* @param routes routes object.
	*/
	function defineRoutes$1(routes) {
		return routes;
	}
	exports.defineRoutes = defineRoutes$1;
}) });

//#endregion
//#region app/index.ts
var import_dist = /* @__PURE__ */ __toESM$2(require_dist());
var app_default = (0, import_dist.defineRoutes)({ ALL(req, res) {
	res.send("Hello World~!");
} });

//#endregion
module.exports = app_default;
//# sourceMappingURL=index.js.map