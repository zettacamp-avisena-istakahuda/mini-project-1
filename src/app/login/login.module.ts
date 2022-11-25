import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [
    LoginFormComponent
  ],
  imports: [
    CommonModule, SharedModuleModule, LoadingSpinnerModule
  ],
  exports:[LoginFormComponent]
})
export class LoginModule { }
