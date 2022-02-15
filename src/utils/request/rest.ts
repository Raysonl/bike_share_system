import axios, { CancelTokenSource, Method } from "axios";
import { getToken } from "utils/auth";
import { httpInstance } from "./instance";
import { IRequestHandler } from "./types";

class Request {
  method: any;
  options: any;
  route: any;
  source: CancelTokenSource;
  path: string;

  private $axios = httpInstance;

  constructor(method: Method, path: string, options: any) {
    this.method = method;
    this.options = options;
    this.route = options.route;
    this.source = axios.CancelToken.source();
    const { ref } = options;
    ref && ref(this);

    let queryString = "";
    if (options.query) {
      // Filter out undefined query options
      const query = Object.entries(options.query).filter(
        ([, value]) => value !== null && typeof value !== "undefined"
      );
      //@ts-ignore
      queryString = new URLSearchParams(query).toString();
    }
    this.path = `${path}${queryString && `?${queryString}`}`;
  }

  cancel(reason?: string | undefined) {
    this.source.cancel(reason);
  }

  onUploadProgress(e) {
    const { onUploadProgress } = this.options;
    onUploadProgress && onUploadProgress({ loaded: e.loaded, total: e.total });
  }

  onDownloadProgress(e) {
    const { onDownloadProgress } = this.options;
    onDownloadProgress &&
      onDownloadProgress({ loaded: e.loaded, total: e.total });
  }

  make() {
    const url = this.path;
    let headers = {};
    if (this.options.headers) {
      headers = Object.assign(headers, this.options.headers);
    }
    if (this.options.authorization) {
      headers["Authorization"] = this.options.authorization;
    }
    if (this.options.userAgent) {
      headers["User-Agent"] = this.options.userAgent;
    }
    let body;
    if (this.options.files) {
      body = new FormData();
      // eslint-disable-next-line
      for (const file of this.options.files) {
        body.append(file.name, file);
      }
      if (typeof this.options.data !== "undefined") {
        body.append(
          "payload_json",
          JSON.stringify(this.options.data, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
          )
        );
      }
    } else if (this.options.data) {
      body = JSON.stringify(this.options.data, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      );
      headers["Content-Type"] = "application/json";
    }

    return this.$axios({
      method: this.method,
      url,
      headers,
      data: body,
      onUploadProgress: this.onUploadProgress.bind(this),
      onDownloadProgress: this.onDownloadProgress.bind(this),
      cancelToken: this.source.token,
      timeout: this.options.timeout || 30000,
      transformResponse: (res) => {
        // FIXME: temp hack for put/delete
        if (res) return JSON.parse(res);
        return res;
      },
    });
  }

  static isCancel(error) {
    return axios.isCancel(error);
  }
}

const RequestTaskStates = Object.freeze({
  READY: 0,
  RUNNING: 1,
  RESOLVE: 2,
  REJECT: 3,
  CANCEL: 4,
});

class RequestTask {
  request: Request;
  resolve: any;
  reject: any;
  id: string;
  uploadProgress: number;
  downloadProgress: number;
  state: number;
  deleter?: (task: RequestTask) => void;

  constructor(task: any, deleter?: (task: RequestTask) => void) {
    this.request = task.request;
    this.resolve = task.resolve;
    this.reject = task.reject;
    this.id = "";
    this.uploadProgress = 0;
    this.downloadProgress = 0;
    this.state = RequestTaskStates.READY;
    this.deleter = deleter;
  }

  cancel(reason?: string | undefined) {
    if (this.state === RequestTaskStates.RUNNING) {
      this.request.cancel(reason);
    } else if (this.state === RequestTaskStates.READY) {
      this.deleter && this.deleter(this);
    }
  }
}

class RequestHandler {
  busy: boolean;
  queue: Array<RequestTask>;
  executingTask: any;

  constructor() {
    this.busy = false;
    this.queue = [];
    this.executingTask = null;
  }

  push(task: any) {
    const t = new RequestTask(task, (task) => {
      this._cancel(task);
    });
    if (this.busy) {
      this.queue.push(t);
      return this.run();
    } else {
      return this.execute(t);
    }
  }

  _cancel(task: RequestTask) {
    const index = this.queue.findIndex((t) => t === task);
    if (index) {
      this.queue.splice(index, 1).map((i) => i.cancel());
    }
  }

  run() {
    if (this.queue.length === 0) {
      return Promise.resolve();
    } else {
      if (this.busy) {
        return Promise.resolve();
      } else {
        const task = this.queue.shift();
        if (!task) {
          return;
        }
        return this.execute(task);
      }
    }
  }

  async execute(task: RequestTask) {
    this.busy = true;
    this.executingTask = task;
    const { resolve, reject, request } = task;
    let response;
    try {
      task.state = RequestTaskStates.RUNNING;
      response = await request.make();
    } catch (error) {
      this.busy = false;
      if (Request.isCancel(error)) {
        task.state = RequestTaskStates.CANCEL;
      } else {
        task.state = RequestTaskStates.REJECT;
      }
      return reject(error);
    }
    this.busy = false;
    this.executingTask = null;
    task.state = RequestTaskStates.RESOLVE;

    resolve(response.data);
    return this.run();
  }
}

class RESTManagerStatic {
  handlers: Map<string, RequestHandler>;
  token: string;

  constructor() {
    this.handlers = new Map();
    this.token = "";
  }

  get api() {
    return buildRoute(this);
  }

  push(handler: RequestHandler, request) {
    return new Promise((resolve, reject) => {
      handler
        .push({
          request,
          resolve,
          reject,
        })
        .catch(reject);
    });
  }

  async request(method: Method, url: string, options = {} as any) {
    if (
      options.auth !== false &&
      typeof options.authorization === "undefined"
    ) {
      const token = options.token ?? (await getToken());
      if (token) {
        options.authorization = token; // JWT
      }
      delete options.auth;
    }
    const request = new Request(method, url, options);
    let handler = this.handlers.get(request.route);

    if (!handler) {
      handler = new RequestHandler();
      this.handlers.set(request.route, handler);
    }
    return this.push(handler, request);
  }
}

const noop = () => {};
const methods = ["get", "post", "delete", "patch", "put"];
const reflectors = [
  "toString",
  "valueOf",
  "inspect",
  "constructor",
  Symbol.toPrimitive,
  Symbol.for("util.inspect.custom"),
];

function buildRoute(manager: RESTManagerStatic): IRequestHandler {
  const route = [""];
  const handler = {
    get(target, name) {
      if (reflectors.includes(name)) return () => route.join("/");
      if (methods.includes(name)) {
        return async (options) =>
          await manager.request(name, route.join("/"), {
            route: route.join("/"),
            ...options,
          });
      }
      route.push(name);
      return new Proxy(noop, handler);
    },
    apply(target, _, args) {
      route.push(...args.filter((x) => x != null)); // eslint-disable-line eqeqeq
      return new Proxy(noop, handler);
    },
  };
  return new Proxy(noop, handler);
}

export const RESTManager = new RESTManagerStatic();
