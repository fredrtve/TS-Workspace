<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [optimistic-http](./optimistic-http.md) &gt; [\_optimisticHttpRequest](./optimistic-http._optimistichttprequest.md)

## \_optimisticHttpRequest variable

<b>Signature:</b>

```typescript
_optimisticHttpRequest: (payload: {
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
    readonly stateSnapshot: {};
}) => {
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
    readonly stateSnapshot: {};
    readonly type: "Optimistic Http Request";
}
```