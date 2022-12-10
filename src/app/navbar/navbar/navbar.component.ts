import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from 'src/app/login/login-form/login-form.component';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';
import { Router } from "@angular/router"


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private subsCart = new SubSink();
  private subsLogOut = new SubSink();
  cartAmount!: number;
  isLogin: any;
  status: any
  token = localStorage.getItem('token')
  role = localStorage.getItem('user_type');

  constructor(private dialog: MatDialog, public service: ApiServiceService,
    private translate: TranslateService, private router: Router) { }

  ngOnInit(): void {    
    this.subsCart.sink = this.service.getAllTransactions('pending', true).valueChanges.subscribe((resp: any) => {
      this.cartAmount = resp.data.getAllTransactions.data.length
    })
    this.isLogin = localStorage.getItem('token')
    if (this.isLogin) {
      this.status = 'Logout'
    }
    else {
      this.status = 'Login'
    }
  }

  openDialog(): void {
    this.dialog.open(LoginFormComponent, {
      width: '250px',
      panelClass: 'custom-modalbox',
    });
  }

  logAction() {
    if (this.isLogin) {
      Swal.fire({
        title: 'Beneran mau logout?',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: `Ga jadi`,
        confirmButtonText: `Iya keluar`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.subsLogOut.sink = this.service.logout().subscribe((resp: any) => {
            if (resp) {
              localStorage.clear()
              window.location.replace("/homepage")
            }
          })

        }
      })

    }
    else {
      this.router.navigate(['login'])

      // this.dialog.open(LoginFormComponent, {
      //   width: '250px',
      //   panelClass: 'custom-modalbox',
      // });
    }
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.service.selectedLang = lang
  }

}
