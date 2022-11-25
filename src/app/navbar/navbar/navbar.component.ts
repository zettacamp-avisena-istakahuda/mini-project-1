import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from 'src/app/login/login-form/login-form.component';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
private subsCart = new SubSink();
cartAmount!: number;
isLogin: any;
status:any

  constructor(private dialog: MatDialog, private service: ApiServiceService) { }

  ngOnInit(): void {
    this.subsCart.sink = this.service.getAllTransactions('pending', true).valueChanges.subscribe((resp: any) => {
      this.cartAmount = resp.data.getAllTransactions.data.length
    })
    this.isLogin = localStorage.getItem('token')
    if(this.isLogin){
        this.status = 'Logout'
    }
    else{
      this.status = 'Login'
    }
  }

  openDialog(): void {
    this.dialog.open(LoginFormComponent, {
      width: '250px',
      panelClass: 'custom-modalbox',
    });
  }

  logAction(){
    if(this.isLogin){
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
          localStorage.clear()
          window.location.reload()
        }
      })

    }
    else{
      this.dialog.open(LoginFormComponent, {
        width: '250px',
        panelClass: 'custom-modalbox',
      });
    }
  }

}
