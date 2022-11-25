import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { SubSink } from 'subsink';
import { ApiServiceService } from './services/api-service.service';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mini_project_1';
  selectedLang = 'en';
  isShowing: boolean = false
  private subsCart = new SubSink();
  cartAmount: any;
  userType!: any



  constructor(private service: ApiServiceService, private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.subsCart.sink = this.service.getAllTransactions('pending', true).valueChanges.subscribe((resp: any) => {
      this.cartAmount = resp.data.getAllTransactions.data.length
    })
    this.userType = localStorage.getItem('user_type')
  }

  toggleSidenav() {
    this.isShowing = !this.isShowing;
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }
}

