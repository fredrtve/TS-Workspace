import { User } from "@core/models";
import { Immutable } from "@fretve/global-types";

export function _getAuthenticatedResources<T extends {allowedRoles?: string[]}>(resources: T[], user: Immutable<User>): T[] {
    if(!resources) return [];
    const authResources: T[] = [];
    for(const resource of resources){
        if(!resource.allowedRoles || resource.allowedRoles.indexOf(user.role) !== -1)
            authResources.push(resource);
    }
    return authResources;
}