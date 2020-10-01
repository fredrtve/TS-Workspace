import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppDocumentType, MissionDocument } from 'src/app/core/models';
import { BaseModelFormViewComponent } from 'src/app/core/services/model/form/abstracts/base-model-form-view.component';
import { ModelFormViewConfig } from 'src/app/core/services/model/form/interfaces';
import { SaveModelWithFileStateCommand } from 'src/app/core/services/model/interfaces';
import { DocumentFileExtensions } from 'src/app/shared/constants/document-file-extensions.const';
import { fileExtensionValidator } from 'src/app/shared/validators/file-extension.validator';
import { MissionDocumentFormState } from './mission-document-form-state.interface';

type ViewConfig = ModelFormViewConfig<MissionDocument, MissionDocumentFormState>;
type Response = SaveModelWithFileStateCommand<MissionDocument>;

@Component({
  selector: 'app-mission-document-form-view',
  templateUrl: './mission-document-form-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionDocumentFormViewComponent extends BaseModelFormViewComponent<MissionDocumentFormState, MissionDocument, ViewConfig, Response> {

  constructor(private _formBuilder: FormBuilder) { super(); }

  onFileChange(e) { 
    let file = null;
    if(e.target.files.length > 0) 
      file = e.target.files[0]; 

    this.file.markAsDirty();
    this.file.setValue(file);
  }

  protected _initalizeForm(cfg: ViewConfig): FormGroup{
    return this._formBuilder.group({
      missionId: cfg.lockedValues?.missionId,
      file: [null, [
        Validators.required,
        fileExtensionValidator(DocumentFileExtensions)
      ]],
      documentType: this._formBuilder.group({
        name: [null, [
          Validators.required,
          Validators.maxLength(45)
        ]]
      }),
    });
  }

  protected _convertFormDataToResponse(): Response{
    let document = this.form.getRawValue();
    let existingType: AppDocumentType;

    if(this.config?.foreigns){
      existingType = this.config.foreigns.documentTypes?.find(x => x.name === this.documentTypeName.value);
    }

    if(existingType) document.documentTypeId = existingType.id;

    if(!document.documentType.name) document.documentTypeId = null;

    if(existingType || !document.documentType.name) document.documentType = null;
    const file = document.file;
    delete document.file;
    return {entity: document, file};
  }

  get file(){
    return this.form.get('file')
  }

  get documentType(){
    return this.form.get('documentType')
  }

  get documentTypeName(){
    return this.form.get(['documentType','name'])
  }
}
