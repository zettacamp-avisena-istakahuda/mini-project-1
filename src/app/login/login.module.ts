import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
@NgModule({
  declarations: [
    LoginFormComponent,
    AccountSettingComponent,
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule, SharedModuleModule, LoadingSpinnerModule, TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  exports:[LoginFormComponent, AccountSettingComponent]
})
export class LoginModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}