import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModelFile } from '@core/models';
import { BottomSheetMenuService } from '@core/services/ui/bottom-sheet-menu.service';
import { AppButton } from '@shared-app/interfaces/app-button.interface';
import { FileFolder } from "@shared/enums/file-folder.enum";
import { Maybe } from 'global-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilKeyChanged } from 'rxjs/operators';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent {
  toolbarHidden = false;

  @Input() images: Maybe<ModelFile[]>;
  @Input() currentImage: ModelFile;
  @Input() actions: AppButton[];
  @Input() folder: FileFolder;

  @Output() currentImageChanged = new EventEmitter();
  @Output() closed = new EventEmitter();

  index: number;

  private loadingImageSubject = new BehaviorSubject<{loading: boolean}>({loading: true});

  loadingImage$: Observable<{loading: boolean}> = 
    this.loadingImageSubject.asObservable().pipe(
      distinctUntilKeyChanged("loading"), 
      debounceTime(10)
    );

  constructor(private menuService: BottomSheetMenuService){};
  
  ngOnInit() {
    if(this.currentImage && this.images?.length)
      this.index = this.images.findIndex(x => x.id == this.currentImage.id);
  }

  onCurrentImageLoaded = () => 
    this.loadingImageSubject.next({loading: false})
  

  changeCurrentImage(image: ModelFile){
    this.loadingImageSubject.next({loading: true})
    this.currentImage = image;
    this.currentImageChanged.emit(image);
  }

  nextImage(): void{
    if(!this.images?.length || this.index >= this.images.length - 1) return;
    this.index++
    this.changeCurrentImage(this.images[this.index]);
  }

  previousImage(): void{
    if(!this.images?.length || this.index <= 0) return
    this.index--;
    this.changeCurrentImage(this.images[this.index]);
  }

  close = () => this.closed.emit();

  openBottomSheet = () => this.menuService.open(this.actions);
  
}
