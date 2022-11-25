import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { NavbarModule } from '../navbar/navbar.module';
import { MenuComponent } from './menu/menu.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

@NgModule({
  declarations: [
    HomepageComponent,
    MenuComponent,
    CartPageComponent,
    TransactionHistoryComponent
  ],
  imports: [
    CommonModule, SharedModuleModule, NavbarModule, LoadingSpinnerModule
  ],
  exports: [HomepageComponent, MenuComponent]
})
export class HomepageModule { }
