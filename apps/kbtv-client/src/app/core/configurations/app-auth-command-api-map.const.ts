import { environment } from "src/environments/environment";
import { AuthCommandApiMap } from "state-auth";
import { ApiUrl } from "../api-url.enum";

export const AppAuthCommandApiMap: AuthCommandApiMap = {
    refreshToken: { method: "POST", apiUrl: environment.apiUrl + ApiUrl.Auth + '/refresh' },
    login: { method: "POST", apiUrl: environment.apiUrl + ApiUrl.Auth + '/login' },
    logout: { method: "POST", apiUrl: environment.apiUrl + ApiUrl.Auth + '/logout' }
}