
import { Pipe, PipeTransform } from '@angular/core';
import { Maybe } from '@fretve/global-types';

@Pipe({name: 'appImageUrlRatio'})
export class AppImageUrlRatioPipe implements PipeTransform {

  constructor(){}

  transform(fileUrl: Maybe<string>): Maybe<number> {
    if(!fileUrl) return null;
    
    var ratioString = fileUrl.substring(fileUrl.lastIndexOf('_') + 1, fileUrl.lastIndexOf('.'));

    if(ratioString.substr(0, 5) !== "ratio") return null;

    const ratio = ratioString.substr(6, ratioString.length - 1)

    return parseFloat(ratio);
  }

}