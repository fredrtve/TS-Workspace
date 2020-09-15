import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileExtension'
})
export class FileExtensionPipe implements PipeTransform {

  transform(value: string): string {
    return value?.split('.').pop();
  }

}
