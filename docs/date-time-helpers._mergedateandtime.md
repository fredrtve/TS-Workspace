<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [date-time-helpers](./date-time-helpers.md) &gt; [\_mergeDateAndTime](./date-time-helpers._mergedateandtime.md)

## \_mergeDateAndTime() function

Merge a date value and a time value to a datetime value.

<b>Signature:</b>

```typescript
export declare function _mergeDateAndTime(date: string | number | {
    readonly toString: () => string;
    readonly toDateString: () => string;
    readonly toTimeString: () => string;
    readonly toLocaleString: {
        (): string;
        (locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions | undefined): string;
    };
    readonly toLocaleDateString: {
        (): string;
        (locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions | undefined): string;
    };
    readonly toLocaleTimeString: {
        (): string;
        (locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions | undefined): string;
    };
    readonly valueOf: () => number;
    readonly getTime: () => number;
    readonly getFullYear: () => number;
    readonly getUTCFullYear: () => number;
    readonly getMonth: () => number;
    readonly getUTCMonth: () => number;
    readonly getDate: () => number;
    readonly getUTCDate: () => number;
    readonly getDay: () => number;
    readonly getUTCDay: () => number;
    readonly getHours: () => number;
    readonly getUTCHours: () => number;
    readonly getMinutes: () => number;
    readonly getUTCMinutes: () => number;
    readonly getSeconds: () => number;
    readonly getUTCSeconds: () => number;
    readonly getMilliseconds: () => number;
    readonly getUTCMilliseconds: () => number;
    readonly getTimezoneOffset: () => number;
    readonly setTime: (time: number) => number;
    readonly setMilliseconds: (ms: number) => number;
    readonly setUTCMilliseconds: (ms: number) => number;
    readonly setSeconds: (sec: number, ms?: number | undefined) => number;
    readonly setUTCSeconds: (sec: number, ms?: number | undefined) => number;
    readonly setMinutes: (min: number, sec?: number | undefined, ms?: number | undefined) => number;
    readonly setUTCMinutes: (min: number, sec?: number | undefined, ms?: number | undefined) => number;
    readonly setHours: (hours: number, min?: number | undefined, sec?: number | undefined, ms?: number | undefined) => number;
    readonly setUTCHours: (hours: number, min?: number | undefined, sec?: number | undefined, ms?: number | undefined) => number;
    readonly setDate: (date: number) => number;
    readonly setUTCDate: (date: number) => number;
    readonly setMonth: (month: number, date?: number | undefined) => number;
    readonly setUTCMonth: (month: number, date?: number | undefined) => number;
    readonly setFullYear: (year: number, month?: number | undefined, date?: number | undefined) => number;
    readonly setUTCFullYear: (year: number, month?: number | undefined, date?: number | undefined) => number;
    readonly toUTCString: () => string;
    readonly toISOString: () => string;
    readonly toJSON: (key?: any) => string;
} | undefined, time: Immutable<DateInput>): Immutable<Date>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  date | string \| number \| { readonly toString: () =&gt; string; readonly toDateString: () =&gt; string; readonly toTimeString: () =&gt; string; readonly toLocaleString: { (): string; (locales?: string \| string\[\] \| undefined, options?: Intl.DateTimeFormatOptions \| undefined): string; }; readonly toLocaleDateString: { (): string; (locales?: string \| string\[\] \| undefined, options?: Intl.DateTimeFormatOptions \| undefined): string; }; readonly toLocaleTimeString: { (): string; (locales?: string \| string\[\] \| undefined, options?: Intl.DateTimeFormatOptions \| undefined): string; }; readonly valueOf: () =&gt; number; readonly getTime: () =&gt; number; readonly getFullYear: () =&gt; number; readonly getUTCFullYear: () =&gt; number; readonly getMonth: () =&gt; number; readonly getUTCMonth: () =&gt; number; readonly getDate: () =&gt; number; readonly getUTCDate: () =&gt; number; readonly getDay: () =&gt; number; readonly getUTCDay: () =&gt; number; readonly getHours: () =&gt; number; readonly getUTCHours: () =&gt; number; readonly getMinutes: () =&gt; number; readonly getUTCMinutes: () =&gt; number; readonly getSeconds: () =&gt; number; readonly getUTCSeconds: () =&gt; number; readonly getMilliseconds: () =&gt; number; readonly getUTCMilliseconds: () =&gt; number; readonly getTimezoneOffset: () =&gt; number; readonly setTime: (time: number) =&gt; number; readonly setMilliseconds: (ms: number) =&gt; number; readonly setUTCMilliseconds: (ms: number) =&gt; number; readonly setSeconds: (sec: number, ms?: number \| undefined) =&gt; number; readonly setUTCSeconds: (sec: number, ms?: number \| undefined) =&gt; number; readonly setMinutes: (min: number, sec?: number \| undefined, ms?: number \| undefined) =&gt; number; readonly setUTCMinutes: (min: number, sec?: number \| undefined, ms?: number \| undefined) =&gt; number; readonly setHours: (hours: number, min?: number \| undefined, sec?: number \| undefined, ms?: number \| undefined) =&gt; number; readonly setUTCHours: (hours: number, min?: number \| undefined, sec?: number \| undefined, ms?: number \| undefined) =&gt; number; readonly setDate: (date: number) =&gt; number; readonly setUTCDate: (date: number) =&gt; number; readonly setMonth: (month: number, date?: number \| undefined) =&gt; number; readonly setUTCMonth: (month: number, date?: number \| undefined) =&gt; number; readonly setFullYear: (year: number, month?: number \| undefined, date?: number \| undefined) =&gt; number; readonly setUTCFullYear: (year: number, month?: number \| undefined, date?: number \| undefined) =&gt; number; readonly toUTCString: () =&gt; string; readonly toISOString: () =&gt; string; readonly toJSON: (key?: any) =&gt; string; } \| undefined | A date input specifying the date of the result. |
|  time | Immutable&lt;DateInput&gt; | A date input specifying the time of the result. |

<b>Returns:</b>

Immutable&lt;Date&gt;

