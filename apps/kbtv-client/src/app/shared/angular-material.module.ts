import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { CssLoaderService } from '@core/services/css-loader.service';
import { LazyStyles } from '@shared-app/enums/lazy-styles.enum';


@NgModule({
   imports: [
      ScrollingModule, 
      MatBottomSheetModule,
      MatChipsModule,
   ],
   providers: [
      MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
      MAT_SELECT_SCROLL_STRATEGY_PROVIDER
   ],
   exports: [
      ScrollingModule,  
      MatBottomSheetModule,  
      MatChipsModule,
   ],
})
export class AngularMaterialModule {
   constructor(cssLoaderService: CssLoaderService){
      cssLoaderService.load(LazyStyles.MatShared)
   }
}
