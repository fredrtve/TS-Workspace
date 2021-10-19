import { IAddress } from "@core/models/sub-interfaces/iaddress.interface";

export function _isAddressEntity(entity: any): entity is IAddress {
    return entity?.address !== undefined;
}