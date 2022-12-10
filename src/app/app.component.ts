import { Component, OnInit, AfterContentInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ApiServiceService } from './services/api-service.service';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterContentInit {
  title = 'mini_project_1';
  selectedLang = 'en';
  isShowing: boolean = false
  private subsCart = new SubSink();
  private subsUser = new SubSink();
  private subsLogout = new SubSink()
  cartAmount: any;
  userType!: any



  constructor(private service: ApiServiceService, private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');

  }

  ngOnInit(): void {
    this.subsUser.sink = this.service.getOneUser().valueChanges.subscribe((resp: any) => {
      if (resp) {        
        this.service.userData.img! = resp.data.getOneUser.img;
        this.service.userData.fullName! = resp.data.getOneUser.fullName
        this.service.userData.balance! = resp.data.getOneUser.balance
      }

    })

    this.subsCart.sink = this.service.getAllTransactions('pending', true).valueChanges.subscribe((resp: any) => {
      this.cartAmount = resp.data.getAllTransactions.data.length
    }, err => {
      if (err.message === "jwt expired") {
        this.logout()
      }

    })
    this.userType = localStorage.getItem('user_type')
  }

  ngAfterContentInit(): void {
    console.log("check")
  }

  toggleSidenav() {
    this.isShowing = !this.isShowing;
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }

  logout(){
    this.subsLogout.sink = this.service.logout().subscribe((resp: any) => {
      if (resp) {
        console.log("tes");
        
        localStorage.clear()
        window.location.replace("/login")
      }
    })
  }
}

