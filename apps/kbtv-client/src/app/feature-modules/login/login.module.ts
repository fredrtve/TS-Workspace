import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    LoginRoutingModule, 
    MatFormFieldModule,
    MatInputModule,  
  ],
})
export class LoginModule {}
