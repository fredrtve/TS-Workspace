import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credentials } from 'state-auth';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginFormComponent {
  @Output() submitted = new EventEmitter<Credentials>();
  @Input() disabled: boolean;
  
  authForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder
  ) {
    this.authForm = this.fb.group({
      userName: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  submitForm = () => {
    const {value, valid} = this.authForm
    if(valid) this.submitted.emit(value)
  };

  get userName() {
    return this.authForm.get('userName');
  }

  get password() {
    return this.authForm.get('password');
  }
}
