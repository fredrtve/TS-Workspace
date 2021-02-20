import { StateAction } from 'state-management'
import { QueuedCommand } from '../../interfaces';

export const HttpQueuePushAction = "HTTP_QUEUE_PUSH_ACTION";
export interface HttpQueuePushAction<TOptions = {}> extends StateAction {
    command: QueuedCommand<TOptions>
}