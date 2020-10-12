import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModelFile } from 'src/app/core/models';
import { BottomSheetMenuService } from 'src/app/core/services/ui/bottom-sheet-menu.service';
import { AppButton } from 'src/app/shared-app/interfaces';
import { MainTopNavConfig } from 'src/app/shared/components/main-top-nav-bar/main-top-nav.config';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ImageViewerComponent {
  toolbarHidden = false;

  @Input() images: ModelFile[];
  @Input() currentImage: ModelFile;
  @Input() actions: AppButton[];
  
  @Output() currentImageChanged = new EventEmitter();
  @Output() closed = new EventEmitter();

  index: number;

  constructor(private menuService: BottomSheetMenuService){};

  ngOnInit() {
    if(this.currentImage)
      this.index = this.images.findIndex(x => x.id == this.currentImage.id);
    // this.currentImage = this.images[this.index];
  }

  changeCurrentImage(image: ModelFile){
    this.currentImage = image;
    this.currentImageChanged.emit(image);
  }

  nextImage(){
    if(this.index >= this.images.length - 1) return null;
    this.index++
    this.changeCurrentImage(this.images[this.index]);
  }

  previousImage(){
    if(this.index <= 0) return null
    this.index--;
    this.changeCurrentImage(this.images[this.index]);
  }

  close = () => this.closed.emit();

  openBottomSheet = () => this.menuService.open(this.actions);
  
}
