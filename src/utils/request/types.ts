export interface RequestOptions {
  route?: string;
  query?: { [key: string]: any };
  data?: any;
  files?: File[];
  auth?: boolean;
  authorization?: string;
  userAgent?: string;
  headers?: { [key: string]: any };
  timeout?: number;
  ref?: (req: Request) => void;
  token?: string;
  callbacks?: {
    onUploadProgress?: (e: { loaded: number; total: number }) => void;
    onDownloadProgress?: (e: { loaded: number; total: number }) => void;
  };
}

export interface IRequestHandler<T = RequestOptions> {
  (id?: string): IRequestHandler;
  // @ts-ignore
  get<P = unknown>(options?: T): Promise<P>;
  // @ts-ignore
  post<P = unknown>(options?: T): Promise<P>;
  // @ts-ignore
  patch<P = unknown>(options?: T): Promise<P>;
  // @ts-ignore
  delete<P = unknown>(options?: T): Promise<P>;
  // @ts-ignore
  put<P = unknown>(options?: T): Promise<P>;
  [key: string]: IRequestHandler;
}
