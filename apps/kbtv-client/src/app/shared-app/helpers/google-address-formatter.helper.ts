import { IAddress } from "@core/models/sub-interfaces/iaddress.interface";

export function _googleAddressFormatter<T extends IAddress>(t: T): T {
    return {...t, address: t.address?.replace(', Norge', '') }
}