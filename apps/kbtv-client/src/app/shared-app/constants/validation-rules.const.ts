export const ValidationRules = {
    PhoneNumberMinLength: 4,
    PhoneNumberMaxLength: 12,

    NameMaxLength: 45,

    AddressMaxLength: 100,

    MissionDescriptionMaxLength: 400,

    MissionNoteTitleMaxLength: 75,

    MissionNoteContentMaxLength: 400,

    TimesheetCommentMaxLength: 400,

    UserPasswordMinLength: 7,
    UserPasswordMaxLength: 100,
    
    ContentMaxByteLength: 62914560,

    MissionDocumentFileExtensions: [
        "doc","docm", "docx", "txt", 
        "pdf", "dot", "csv", "dotm", 
        "dotx", "xla", "odt", "xlam", 
        "xls", "xlsb", "xlsm", "xlsx", 
        "xlt", "xlw"
    ],

    MissionImageFileExtensions: ["jpg", "jpeg", "png"]
}