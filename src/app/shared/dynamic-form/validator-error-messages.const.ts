export interface ValidationErrorMap {
    [key: string]: (err: any) => string 
}

export const ValidatorErrorMessages: ValidationErrorMap = {
    required: (err: any) => "Dette feltet er obligatorisk.",
    maxlength: (err: any) => `Dette feltet kan ikke overstige ${err.requiredLength} tegn.`,
    minlength: (err: any) => `Dette feltet må være på minst ${err.requiredLength} tegn.`,
    fileextension: (err: any) => "Filtypen er ikke tillatt.",
    isunique: (err: any) => "Dette feltet må være unikt og verdien finnes allerede.",
    isobject: (err: any) => "Ugyldig verdi.",
    daterange: (err: any) => "Det mangler en eller flere datoer.",
    email: (err: any) => "Eposten er ikke skrevet riktig."
}