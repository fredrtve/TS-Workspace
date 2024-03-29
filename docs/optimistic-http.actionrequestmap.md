<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [optimistic-http](./optimistic-http.md) &gt; [ActionRequestMap](./optimistic-http.actionrequestmap.md)

## ActionRequestMap type

A map of actions that should dispatch an optimistic http request. Provided with token [ACTION\_REQUEST\_MAP](./optimistic-http.action_request_map.md) or with the forRoot &amp; forFeature functions on [OptimisticHttpModule](./optimistic-http.optimistichttpmodule.md)

<b>Signature:</b>

```typescript
export declare type ActionRequestMap<TActions extends StateAction> = {
    [P in TActions as P['type']]: ActionRequestConverterFn<P>;
};
```
<b>References:</b> [ActionRequestConverterFn](./optimistic-http.actionrequestconverterfn.md)

