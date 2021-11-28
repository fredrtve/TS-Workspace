import { Maybe } from '@fretve/global-types';
import { NotificationType } from './notification-type.enum';

/** Represents an object with data required to display a notification */
export interface AppNotification {
    /** The type of notification which determines styling and duration */
    type: NotificationType;
    /** A title on the notification snack bar*/
    title?: string;
    /** Additional information displayed as a list of strings */
    details?: Maybe<string>[];
    /** A custom duration that the notification will be displayed for */
    duration?: number;
    /** CSS class applied to panel */
    panelClass?: string;
}