import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { NavbarModule } from '../navbar/navbar.module';
import { MenuComponent } from './menu/menu.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
@NgModule({
  declarations: [
    HomepageComponent,
    MenuComponent,
    CartPageComponent,
    TransactionHistoryComponent
  ],
  imports: [
    CommonModule, SharedModuleModule, NavbarModule, LoadingSpinnerModule, TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  exports: [HomepageComponent, MenuComponent]
})
export class HomepageModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
