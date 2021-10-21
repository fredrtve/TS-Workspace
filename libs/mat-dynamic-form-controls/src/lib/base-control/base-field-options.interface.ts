/** Describes the data required to display a control in the form */
 export interface BaseFieldOptions {
    /** A placeholder value for the field */
    placeholder$?: string;
    /** A label describing the field */
    label$?: string;
    ariaLabel$?: string;
    /** A hint helping the user fill out the field */
    hint$?: string;
    /** The color theme of the field */
    color$?: "primary" | "accent";
    /** The width of the field. Use css syntax. */
    width$?: string;
}