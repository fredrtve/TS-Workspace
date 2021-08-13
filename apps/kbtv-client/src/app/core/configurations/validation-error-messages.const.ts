import { translations } from '@shared-app/constants/translations.const';
import { _formatMb } from '@shared-app/helpers/format-mb.helper';
import { ValidationErrorMap } from 'dynamic-forms';
import { Maybe } from 'global-types';

export const ValidationErrorMessages: ValidationErrorMap = {
    required: () => "Dette feltet er obligatorisk.",
    maxlength: (err: {requiredLength: number}) => `Dette feltet kan ikke overstige ${err.requiredLength} tegn.`,
    minlength: (err: {requiredLength: number}) => `Dette feltet må være på minst ${err.requiredLength} tegn.`,
    fileextension: () => "Filtypen er ikke tillatt.",
    isunique: () => "Dette feltet må være unikt og verdien finnes allerede.",
    isobject: (err: {name?: string}) => `Vennligst velg ${!err.name ? '' : (translations[err.name]?.toLowerCase() || '')} fra listen`,
    daterange: () => "Det mangler en eller flere datoer.",
    email: () => "Eposten er ikke skrevet riktig.",
    issamepasswords: () => "Passordene er ikke like.",
    filesize: (err: {maxSize: number}) => `Filstørrelse kan ikke overstige ${_formatMb(err.maxSize)}.`,
    isweeknrinrange: (err: {upperWeekLimit: number}) => `Vennligst velg ett ukenummer fra 1 til ${err.upperWeekLimit}.`
}