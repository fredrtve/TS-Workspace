import { Prop } from '@shared-app/prop.type';

export function _compareProp<T extends Object>(prop: Prop<T>): (option: T, value: T) => boolean {
    return (option: T, value: T) => (option ? option[prop] : null) === (value ? value[prop] : null)
}