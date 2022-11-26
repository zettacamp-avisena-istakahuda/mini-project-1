import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DatePipe } from '@angular/common'

@NgModule({
  declarations: [],
  imports: [
    CommonModule, MatIconModule, MatToolbarModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule,
    ReactiveFormsModule, RouterModule, MatTableModule, BrowserAnimationsModule, BrowserModule, MatSelectModule,
    MatSlideToggleModule, NgxMaterialTimepickerModule, MatNativeDateModule, MatDatepickerModule, MatProgressSpinnerModule, MatSidenavModule, MatTooltipModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [MatIconModule, MatToolbarModule, MatDialogModule,
    MatFormFieldModule, MatDatepickerModule, MatInputModule, MatButtonModule, FormsModule,
    ReactiveFormsModule, MatNativeDateModule, RouterModule, MatTableModule, BrowserAnimationsModule, BrowserModule, MatSelectModule,
    MatProgressSpinnerModule, NgxMaterialTimepickerModule, MatSidenavModule, MatSlideToggleModule, MatTooltipModule],
  providers: [DatePipe]
})
export class SharedModuleModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}