<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-sync](./state-sync.md) &gt; [SyncResponse](./state-sync.syncresponse.md)

## SyncResponse interface

Response from a synchronization request

<b>Signature:</b>

```typescript
export interface SyncResponse<TState> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [arrays](./state-sync.syncresponse.arrays.md) | [SyncArraysResponse](./state-sync.syncarraysresponse.md)<!-- -->&lt;TState&gt; |  |
|  [timestamp](./state-sync.syncresponse.timestamp.md) | number | UNIX milliseconds timestamp when synchronization happen. |
|  [values](./state-sync.syncresponse.values.md) | [SyncValuesResponse](./state-sync.syncvaluesresponse.md)<!-- -->&lt;TState&gt; |  |

