<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [global-types](./global-types.md) &gt; [UnionTupleType](./global-types.uniontupletype.md)

## UnionTupleType type

<b>Signature:</b>

```typescript
export declare type UnionTupleType<A extends any[]> = A extends {
    [n: number]: infer T;
} ? T : never;
```