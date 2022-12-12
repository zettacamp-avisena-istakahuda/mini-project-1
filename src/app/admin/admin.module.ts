import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockManagementComponent } from './stock-management/stock-management.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { IngredientEditFormComponent } from './ingredient-edit-form/ingredient-edit-form.component';
import { NavbarModule } from '../navbar/navbar.module';
import { CreateRecipeFormComponent } from './create-recipe-form/create-recipe-form.component';
import { MenuManagementComponent } from './menu-management/menu-management.component';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { SpecialOfferManagementComponent } from './special-offer-management/special-offer-management.component';
import { SpecialOfferFormComponent } from './special-offer-form/special-offer-form.component';
@NgModule({
  declarations: [
    StockManagementComponent,
    IngredientEditFormComponent,
    CreateRecipeFormComponent,
    MenuManagementComponent,
    SpecialOfferManagementComponent,
    SpecialOfferFormComponent
  ],
  imports: [
    CommonModule, SharedModuleModule, NavbarModule, LoadingSpinnerModule, TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })],
  exports: [StockManagementComponent]
})
export class AdminModule { }
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
