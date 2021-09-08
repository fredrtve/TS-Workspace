/**
 * A library for managing local and global state. 
 * @remarks 
 * The implementation is similar to the redux design pattern. 
 * @packageDocumentation
 */

export * from './lib/store'
export * from './lib/state-management.module'
export * from './lib/interfaces'
export * from './lib/effects/effects.subscriber'
export * from './lib/effects/component-effects.subscriber'
export * from './lib/component.store'
export * from './lib/action-dispatcher'

export * from './lib/operators/listen-to.operator'
export * from './lib/operators/select.operator'
export * from './lib/operators/select-prop.operator'

export * from './lib/helpers/create-reducers.helper'
export * from './lib/helpers/create-action.helper'

export * from './lib/constants/injection-tokens.const'