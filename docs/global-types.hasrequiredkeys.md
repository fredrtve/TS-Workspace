<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [global-types](./global-types.md) &gt; [HasRequiredKeys](./global-types.hasrequiredkeys.md)

## HasRequiredKeys type

<b>Signature:</b>

```typescript
export declare type HasRequiredKeys<T> = T extends object ? RequiredKeys<T> extends never ? false : true : true;
```
<b>References:</b> [RequiredKeys](./global-types.requiredkeys.md)

