import { environment } from 'src/environments/environment';
import { _isBlobUrl } from "./is-blob-url.helper";

export function _appFileUrl(fileName: string, folder: string, disableCache?: boolean): string{ 
    if(_isBlobUrl(fileName)) return fileName; //Check for local file urls
    let url = `${environment.resourceFolders.baseUrl}/${folder}/${fileName}`;
    if(disableCache) url = url + `/?x=${Math.floor(Math.random() * 100)}`
    return url;
};
