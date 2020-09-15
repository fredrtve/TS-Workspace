import { FileFolders } from './file-folders.const';
import { environment } from 'src/environments/environment';

export function appFileUrl(fileName: string, folder: typeof FileFolders[number], disableCache?: boolean): string{ 
    let url = `${environment.fileServerUrl}/${folder}/${fileName}`;
    if(disableCache) url = url + `/?x=${Math.floor(Math.random() * 100)}`
    return url;
};
