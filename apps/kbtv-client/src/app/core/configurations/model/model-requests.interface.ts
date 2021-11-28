import { ModelState } from "@core/state/model-state.interface";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { Immutable } from "@fretve/global-types";
import { StatePropByModel } from "model/core";
import { OptimisticHttpRequest, SupportedContentTypes } from "optimistic-http";
import { ApiUrl } from "../../api-url.enum";
import { ModelFile, User } from "../../models";
import { CommandIdHeader } from "../command-id-header.const";

export interface AppOptimisticHttpRequest<TContentType extends SupportedContentTypes = "json"> extends OptimisticHttpRequest<TContentType> {
    headers: {[CommandIdHeader]: string};
}

export const SaveModelRequest = "SaveModelRequest";
export type SaveModelRequest<TModel> = CreateModelRequest<TModel> | UpdateModelRequest<TModel>;

interface BaseModelRequest<TModel> extends AppOptimisticHttpRequest {
     stateProp: StatePropByModel<ModelState, TModel>, 
     apiUrl: string 
}

export interface CreateModelRequest<TModel> extends BaseModelRequest<TModel> {
    method: "POST";
    body: Partial<TModel>;
    type: typeof SaveModelRequest; 
}

export interface UpdateModelRequest<TModel> extends BaseModelRequest<TModel> {
    method: "PUT";
    body: Partial<TModel>;
    type: typeof SaveModelRequest; 
}

export const DeleteModelRequest = "DeleteModelRequest";
export interface DeleteModelRequest<TModel> extends BaseModelRequest<TModel> {
    method: "DELETE";
    body?: undefined;
    type: typeof DeleteModelRequest;
}

export const DeleteModelRangeRequest = "DeleteModelRangeRequest";
export interface DeleteModelRangeRequest<TModel> extends BaseModelRequest<TModel> {
    method: "POST";
    body: {ids: Immutable<string[] | number[]>};
    type: typeof DeleteModelRangeRequest;
}

export const SaveModelFileRequest = "SaveModelFileRequest";
export type SaveModelFileRequest<TModel extends ModelFile> = CreateModelFileRequest<TModel> | UpdateModelFileRequest<TModel>;

export interface CreateModelFileRequest<TModel extends ModelFile> 
    extends Pick<OptimisticHttpRequest<"formData">, "contentType">,  Omit<CreateModelRequest<TModel & {file: File}>, "type" | "contentType"> {
    type: typeof SaveModelFileRequest;
}

export interface UpdateModelFileRequest<TModel extends ModelFile> 
    extends Pick<OptimisticHttpRequest<"formData">, "contentType">, Omit<UpdateModelRequest<TModel & {file: File}>, "type" | "contentType"> {
    type: typeof SaveModelFileRequest;
}

export const UpdateCurrentUserRequest = "UpdateCurrentUserRequest";
export interface UpdateCurrentUserRequest extends AppOptimisticHttpRequest {
    apiUrl: ApiUrl.Auth;
    method: "PUT";
    body: Immutable<Partial<User>>;
    type: typeof UpdateCurrentUserRequest;
}

export const UpdateTimesheetStatusesRequest = "UpdateTimesheetStatusesRequest";
export interface UpdateTimesheetStatusesRequest extends AppOptimisticHttpRequest {
    apiUrl: `${ApiUrl.Timesheet}/Status`;
    method: "PUT"; 
    body: {ids: Immutable<string[]>, status: TimesheetStatus};
    type: typeof UpdateTimesheetStatusesRequest;
}

export const CreateUserRequest = "CreateUserRequest";
export interface CreateUserRequest extends Pick<AppOptimisticHttpRequest, "body">, Omit<CreateModelRequest<unknown>, "body" | "type"> {
    body: Immutable<Partial<User> & {password: string}>;
    type: typeof CreateUserRequest;
}

export const DeleteMissionHeaderImageRequest = "DeleteMissionHeaderImageRequest";
export interface DeleteMissionHeaderImageRequest extends AppOptimisticHttpRequest {
    method: "PUT";
    type: typeof DeleteMissionHeaderImageRequest;
}