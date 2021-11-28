import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Maybe } from '@fretve/global-types';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DownloaderService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  downloadUrl(url:string, filename?:string) {
    if (!filename) filename = url.split('\\').pop()?.split('/').pop();
    from(fetch(url)).pipe(switchMap(x => from((<Response>x).blob()))).subscribe(blob => {
      let blobUrl = URL.createObjectURL(blob);
      this._downloadLink(blobUrl, filename)
      URL.revokeObjectURL(blobUrl);
    })
  }
  
  downloadUrls = (urls: Maybe<string>[]): void => 
    urls.forEach(url => url ? this.downloadUrl(url) : null)
  
  private _downloadLink = (url: string, filename?: string): void => {
    const body = this.document.getElementsByTagName('body')[0];
    const link = this.document.createElement('a'); 
    link.style.display = 'none';
    link.href = url;
    link.download = filename || url.substring(url.lastIndexOf('/') + 1) || 'download'; 
    body.appendChild(link);
    link.click();
    link.remove();
  };

}