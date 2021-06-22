import { Roles } from "../roles.enum";

export const RolePermissions = {
    DataManagement: {access: [Roles.Admin, Roles.Leder]},
    MissionDocumentList: {
        access: [Roles.Admin, Roles.Leder, Roles.Mellomleder, Roles.Ansatt],
        create: [Roles.Admin, Roles.Leder], 
        delete: [Roles.Admin, Roles.Leder],
        sendEmail: [Roles.Admin, Roles.Leder],
    },
    MissionImageList: {
        create: [Roles.Admin, Roles.Leder, Roles.Mellomleder, Roles.Ansatt],
        delete: [Roles.Admin, Roles.Leder],
        sendEmail: [Roles.Admin, Roles.Leder],
    },
    MissionList: {
        create: [Roles.Admin, Roles.Leder, Roles.Mellomleder],
        update: [Roles.Admin, Roles.Leder],
        delete: [Roles.Admin, Roles.Leder],
    },
    MissionNoteList: {
        access: [Roles.Admin, Roles.Leder, Roles.Mellomleder, Roles.Ansatt],
        create: [Roles.Admin, Roles.Leder, Roles.Mellomleder, Roles.Ansatt],
        update: [Roles.Admin, Roles.Leder],
        delete: [Roles.Admin, Roles.Leder],
    },
    TimesheetAdmin: {
        access: [Roles.Admin, Roles.Leder]
    },
    TimesheetStatistic: {
        access: [Roles.Admin, Roles.Leder]
    },
    Users: {
        access: [Roles.Admin, Roles.Leder]
    },
    UserTimesheetList: {
        access: [Roles.Admin, Roles.Leder, Roles.Mellomleder, Roles.Ansatt]
    },
    UserTimesheetWeek: {
        access: [Roles.Admin, Roles.Leder, Roles.Mellomleder, Roles.Ansatt]
    }
}