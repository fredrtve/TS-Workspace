<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-auth](./state-auth.md) &gt; [HttpAuthTokensInterceptor](./state-auth.httpauthtokensinterceptor.md)

## HttpAuthTokensInterceptor class

Http interceptor responsible for handling tokens and authorization. The interceptor will append access tokens to all requests and optionally refresh access tokens when expired if configured.

<b>Signature:</b>

```typescript
export declare class HttpAuthTokensInterceptor implements HttpInterceptor 
```
<b>Implements:</b> HttpInterceptor

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(authService, commandApiMap)](./state-auth.httpauthtokensinterceptor._constructor_.md) |  | Constructs a new instance of the <code>HttpAuthTokensInterceptor</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [ɵfac](./state-auth.httpauthtokensinterceptor._fac.md) | <code>static</code> | i0.ɵɵFactoryDeclaration&lt;[HttpAuthTokensInterceptor](./state-auth.httpauthtokensinterceptor.md)<!-- -->, never&gt; |  |
|  [ɵprov](./state-auth.httpauthtokensinterceptor._prov.md) | <code>static</code> | i0.ɵɵInjectableDeclaration&lt;[HttpAuthTokensInterceptor](./state-auth.httpauthtokensinterceptor.md)<!-- -->&gt; |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [intercept(req, next)](./state-auth.httpauthtokensinterceptor.intercept.md) |  |  |

