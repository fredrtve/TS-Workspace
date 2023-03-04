<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [optimistic-http](./optimistic-http.md) &gt; [OptimisticActions](./optimistic-http.optimisticactions.md)

## OptimisticActions variable

<b>Signature:</b>

```typescript
OptimisticActions: {
    dispatchNext: () => {
        readonly type: "Dispatch Next Request";
    };
    httpError: (payload: {
        readonly httpError: {
            readonly name: "HttpErrorResponse";
            readonly message: string;
            readonly error: any;
            readonly ok: false;
            readonly headers: {
                readonly has: (name: string) => boolean;
                readonly get: (name: string) => string | null;
                readonly keys: () => string[];
                readonly getAll: (name: string) => string[] | null;
                readonly append: (name: string, value: string | string[]) => import("@angular/common/http").HttpHeaders;
                readonly set: (name: string, value: string | string[]) => import("@angular/common/http").HttpHeaders;
                readonly delete: (name: string, value?: string | string[] | undefined) => import("@angular/common/http").HttpHeaders;
            };
            readonly status: number;
            readonly statusText: string;
            readonly url: string | null;
            readonly type: import("@angular/common/http").HttpEventType.ResponseHeader | import("@angular/common/http").HttpEventType.Response;
        };
    }) => {
        readonly httpError: {
            readonly name: "HttpErrorResponse";
            readonly message: string;
            readonly error: any;
            readonly ok: false;
            readonly headers: {
                readonly has: (name: string) => boolean;
                readonly get: (name: string) => string | null;
                readonly keys: () => string[];
                readonly getAll: (name: string) => string[] | null;
                readonly append: (name: string, value: string | string[]) => import("@angular/common/http").HttpHeaders;
                readonly set: (name: string, value: string | string[]) => import("@angular/common/http").HttpHeaders;
                readonly delete: (name: string, value?: string | string[] | undefined) => import("@angular/common/http").HttpHeaders;
            };
            readonly status: number;
            readonly statusText: string;
            readonly url: string | null;
            readonly type: import("@angular/common/http").HttpEventType.ResponseHeader | import("@angular/common/http").HttpEventType.Response;
        };
        readonly type: "Http Error";
    };
    optimisticHttpError: (payload: {
        readonly canceledCommands: import("global-types").ImmutableArray<CompletedCommand>;
        readonly errorCommand: {
            readonly request: {
                readonly apiUrl: string;
                readonly method: "POST" | "PUT" | "DELETE";
                readonly body?: {} | null | undefined;
                readonly headers?: {
                    readonly [x: string]: string | import("global-types").ImmutableArray<string>;
                } | undefined;
                readonly contentType?: "json" | undefined;
                readonly type?: string | undefined;
            };
            readonly succeeded: boolean;
        };
        readonly httpError: {
            readonly name: "HttpErrorResponse";
            readonly message: string;
            readonly error: any;
            readonly ok: false;
            readonly headers: {
                readonly has: (name: string) => boolean;
                readonly get: (name: string) => string | null;
                readonly keys: () => string[];
                readonly getAll: (name: string) => string[] | null;
                readonly append: (name: string, value: string | string[]) => import("@angular/common/http").HttpHeaders;
                readonly set: (name: string, value: string | string[]) => import("@angular/common/http").HttpHeaders;
                readonly delete: (name: string, value?: string | string[] | undefined) => import("@angular/common/http").HttpHeaders;
            };
            readonly status: number;
            readonly statusText: string;
            readonly url: string | null;
            readonly type: import("@angular/common/http").HttpEventType.ResponseHeader | import("@angular/common/http").HttpEventType.Response;
        };
    }) => {
        readonly canceledCommands: import("global-types").ImmutableArray<CompletedCommand>;
        readonly errorCommand: {
            readonly request: {
                readonly apiUrl: string;
                readonly method: "POST" | "PUT" | "DELETE";
                readonly body?: {} | null | undefined;
                readonly headers?: {
                    readonly [x: string]: string | import("global-types").ImmutableArray<string>;
                } | undefined;
                readonly contentType?: "json" | undefined;
                readonly type?: string | undefined;
            };
            readonly succeeded: boolean;
        };
        readonly httpError: {
            readonly name: "HttpErrorResponse";
            readonly message: string;
            readonly error: any;
            readonly ok: false;
            readonly headers: {
                readonly has: (name: string) => boolean;
                readonly get: (name: string) => string | null;
                readonly keys: () => string[];
                readonly getAll: (name: string) => string[] | null;
                readonly append: (name: string, value: string | string[]) => import("@angular/common/http").HttpHeaders;
                readonly set: (name: string, value: string | string[]) => import("@angular/common/http").HttpHeaders;
                readonly delete: (name: string, value?: string | string[] | undefined) => import("@angular/common/http").HttpHeaders;
            };
            readonly status: number;
            readonly statusText: string;
            readonly url: string | null;
            readonly type: import("@angular/common/http").HttpEventType.ResponseHeader | import("@angular/common/http").HttpEventType.Response;
        };
        readonly type: "Optimistic Http Error";
    };
    queuePush: (payload: {
        readonly command: {
            readonly request: {
                readonly apiUrl: string;
                readonly method: "POST" | "PUT" | "DELETE";
                readonly body?: {} | null | undefined;
                readonly headers?: {
                    readonly [x: string]: string | import("global-types").ImmutableArray<string>;
                } | undefined;
                readonly contentType?: "json" | undefined;
                readonly type?: string | undefined;
            };
            readonly stateSnapshot: {
                readonly [x: string]: unknown;
            } | null | undefined;
            readonly dispatched?: boolean | undefined;
        };
    }) => {
        readonly command: {
            readonly request: {
                readonly apiUrl: string;
                readonly method: "POST" | "PUT" | "DELETE";
                readonly body?: {} | null | undefined;
                readonly headers?: {
                    readonly [x: string]: string | import("global-types").ImmutableArray<string>;
                } | undefined;
                readonly contentType?: "json" | undefined;
                readonly type?: string | undefined;
            };
            readonly stateSnapshot: {
                readonly [x: string]: unknown;
            } | null | undefined;
            readonly dispatched?: boolean | undefined;
        };
        readonly type: "Http Queue Push";
    };
    queueShift: () => {
        readonly type: "Http Queue Shift";
    };
    appendLog: (payload: {
        readonly completedCommands: import("global-types").ImmutableArray<CompletedCommand>;
    }) => {
        readonly completedCommands: import("global-types").ImmutableArray<CompletedCommand>;
        readonly type: "Append Request Log";
    };
}
```