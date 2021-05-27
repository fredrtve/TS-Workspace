import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { _appFileUrl } from '@shared-app/helpers/app-file-url.helper';
import { _isBlobUrl } from '@shared-app/helpers/is-blob-url.helper';
import { FileFolder } from "@shared/enums/file-folder.enum";
import { Maybe } from 'global-types';

@Pipe({name: 'appFileUrl'})
export class AppFileUrlPipe implements PipeTransform {

  constructor(private readonly domSanitizer: DomSanitizer){}

  transform(fileName: Maybe<string>, folder: FileFolder, disableCache?: boolean): Maybe<string> {
    if(!fileName) return null;
    
    if(_isBlobUrl(fileName)) 
      return <string> this.domSanitizer.bypassSecurityTrustResourceUrl(fileName); 

    return _appFileUrl(fileName, folder, disableCache);
  }

}
