import { Pipe, PipeTransform } from '@angular/core';
import { Immutable } from '@fretve/global-types';
import { OptimisticHttpRequest, SupportedContentTypes } from 'optimistic-http';
import { RequestDescriberMap } from '../interfaces/request-describer-map.interface';

type RequestWithType = Omit<OptimisticHttpRequest<SupportedContentTypes>, "type"> & {type: string};

@Pipe({name: 'requestDescription'})
export class RequestDescriptionPipe implements PipeTransform {

  transform<TState>(
    request: Immutable<OptimisticHttpRequest<SupportedContentTypes>>, 
    state: Immutable<TState>,
    descriptions: RequestDescriberMap<RequestWithType, TState>
  ): string {
    if(request.type){
      const describer = descriptions[request.type];
      if(describer) return describer(<Immutable<RequestWithType>> request, state);
    }
    return "Mangler beskrivelse"
  }
}
