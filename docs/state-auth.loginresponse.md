<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [state-auth](./state-auth.md) &gt; [LoginResponse](./state-auth.loginresponse.md)

## LoginResponse interface

Describes the expected result from a login command

<b>Signature:</b>

```typescript
export interface LoginResponse 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [accessToken](./state-auth.loginresponse.accesstoken.md) | [AccessToken](./state-auth.accesstoken.md) |  |
|  [refreshToken?](./state-auth.loginresponse.refreshtoken.md) | string | <i>(Optional)</i> A token used to request a new access token |
|  [user](./state-auth.loginresponse.user.md) | [CurrentUser](./state-auth.currentuser.md) | User details about the authorized user |
