<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-db](./state-db.md) &gt; [StatePropConfig](./state-db.statepropconfig.md)

## StatePropConfig interface

Represents a object with configurations for a state property that should be persisted by the db.

<b>Signature:</b>

```typescript
export interface StatePropConfig 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [onPersistMapping?](./state-db.statepropconfig.onpersistmapping.md) | [MapFn](./state-db.mapfn.md)<!-- -->&lt;any, any&gt; | <i>(Optional)</i> A mapping function that runs before value changes are persisted to the db. |
|  [storageType](./state-db.statepropconfig.storagetype.md) | [StorageType](./state-db.storagetype.md) | Choose which storage type that should be used to persist the given state property |

