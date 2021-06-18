import { ModelFile } from "@core/models";
import { FileFolder } from "@shared-app/enums/file-folder.enum";

export interface ImageViewerDialogWrapperConfig {
    images?: ModelFile[], 
    currentImage: ModelFile,
    fileFolder: FileFolder,
    downloadFolder?: FileFolder,
    deleteAction?: {callback :(id: string) => void, allowedRoles?: string[]};
}