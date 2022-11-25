import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';


@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule, SharedModuleModule
  ],
  exports: [NavbarComponent]
})
export class NavbarModule { }
