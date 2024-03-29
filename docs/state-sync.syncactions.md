<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-sync](./state-sync.md) &gt; [SyncActions](./state-sync.syncactions.md)

## SyncActions variable

<b>Signature:</b>

```typescript
SyncActions: {
    sync: () => {
        readonly type: "Sync State";
    };
    reloadState: () => {
        readonly type: "Reload Sync State";
    };
    updateConfig: (payload: {
        readonly syncConfig: {
            readonly refreshTime: number;
            readonly initialTimestamp: number;
        };
    }) => {
        readonly syncConfig: {
            readonly refreshTime: number;
            readonly initialTimestamp: number;
        };
        readonly type: "Update Sync Config";
    };
    wipeState: (payload: {
        readonly syncStateConfig: {
            readonly [x: string]: {
                readonly type?: "value" | "array" | undefined;
                readonly wipeable?: boolean | undefined;
                readonly idProp: string;
            };
        };
    }) => {
        readonly syncStateConfig: {
            readonly [x: string]: {
                readonly type?: "value" | "array" | undefined;
                readonly wipeable?: boolean | undefined;
                readonly idProp: string;
            };
        };
        readonly type: "Wipe Sync State";
    };
    syncFailed: () => {
        readonly type: "Sync State Failed";
    };
    syncSuccess: (payload: {
        readonly response: {
            readonly timestamp: number;
            readonly arrays: {
                readonly [x: string]: {
                    readonly entities: import("global-types").ImmutableArray<UnknownState>;
                    readonly deletedEntities: import("global-types").ImmutableArray<string | number>;
                };
            };
            readonly values: {
                readonly [x: string]: unknown;
            };
        };
        readonly syncStateConfig: {
            readonly [x: string]: {
                readonly type?: "value" | "array" | undefined;
                readonly wipeable?: boolean | undefined;
                readonly idProp: string;
            };
        };
    }) => {
        readonly response: {
            readonly timestamp: number;
            readonly arrays: {
                readonly [x: string]: {
                    readonly entities: import("global-types").ImmutableArray<UnknownState>;
                    readonly deletedEntities: import("global-types").ImmutableArray<string | number>;
                };
            };
            readonly values: {
                readonly [x: string]: unknown;
            };
        };
        readonly syncStateConfig: {
            readonly [x: string]: {
                readonly type?: "value" | "array" | undefined;
                readonly wipeable?: boolean | undefined;
                readonly idProp: string;
            };
        };
        readonly type: "Sync State Success";
    };
}
```
