import { ModelFile } from "@core/models";

export interface ImageViewerDialogWrapperConfig {
    images?: ModelFile[], 
    currentImage: ModelFile,
    fileFolder: string,
    downloadFolder?: string,
    deleteAction?: {callback :(id: string) => void, allowedRoles?: string[]};
}