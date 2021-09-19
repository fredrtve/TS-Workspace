/**
 * A library for saving or deleting relational model state saved in global state via state management actions.
 * @remarks 
 * The library depends on the 'state-management' library to dispatch relevant actions. 
 * The library does not support many-to-many relationships. 
 * @packageDocumentation
 */

export * from './src/model-state-commands.module';
export * from './src/model-command.enum';
export * from './src/state/actions';
export * from './src/state/reducers';
export * from './src/state/save-model.effect';