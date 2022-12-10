import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';


@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule, SharedModuleModule
  ],
  exports: [SpinnerComponent]
})
export class LoadingSpinnerModule { }
