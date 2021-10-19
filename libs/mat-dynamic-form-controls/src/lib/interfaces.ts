export type ErrorDisplayFn = (err: unknown) => string;

/** Represents a map of validation errors with accociated {@link ErrorDisplayFn} 
 *  Provided with the token {@link VALIDATION_ERROR_MESSAGES} */
export interface ValidationErrorMap { [key: string]: ErrorDisplayFn }
