import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  username = new FormControl('');
  password = new FormControl('');

  isLoading = false;
  private subsLogin = new SubSink();

  constructor(private service: ApiServiceService,
    private dialog: MatDialogRef<LoginFormComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  login() {
    this.isLoading = true;
    this.subsLogin.sink = this.service.login(this.username.value, this.password.value).subscribe(resp => {
      if (resp) {
        this.isLoading = false;
        localStorage.setItem('token', resp.data.getToken.message)
        localStorage.setItem('user_type', resp.data.getToken.user.role)
        localStorage.setItem('user_name',  resp.data.getToken.user.fullName)
        Swal.fire({
          icon: 'success',
          title: 'Login Succesful',
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        // this.router.navigate(['/menu'])
        this.dialog.close()
      }
    }, err => {
      Swal.fire({
        icon: 'error',
        title: err.message,
      })
      this.isLoading = false
    }
    )
  }
}
