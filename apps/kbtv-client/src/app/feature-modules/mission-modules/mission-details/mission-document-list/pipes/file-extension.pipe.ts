import { Pipe, PipeTransform } from '@angular/core';
import { Maybe } from '@fretve/global-types';

@Pipe({name: 'fileExtension'})
export class FileExtensionPipe implements PipeTransform {

  transform(value: Maybe<string>): string {
    if(!value) return "";
    if(value.substr(0, 4) === "blob") return "";
    return value.split('.').pop() || "";
  }

}
