import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModuleModule } from './shared-module/shared-module.module';
import { HomepageModule } from './homepage/homepage.module';
import { LoginModule } from './login/login.module';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { NavbarModule } from './navbar/navbar.module';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LoadingSpinnerModule } from './loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModuleModule,
    HomepageModule,
    LoginModule,
    GraphQLModule, LoadingSpinnerModule,
    HttpClientModule, AdminModule, NavbarModule,  TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
