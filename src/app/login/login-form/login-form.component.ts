import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  formStatus = "Login"
  isLoading = false;
  registerForm: any
  private subsLogin = new SubSink();

  constructor(public service: ApiServiceService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'avatarURL': new FormControl(""),
      'frontName': new FormControl("", Validators.required),
      'lastName': new FormControl("", Validators.required),
      'email': new FormControl("", Validators.email),
      'password': new FormControl("", Validators.required),
      'password2': new FormControl(""),
      'question': new FormControl("", Validators.required),
      'answer': new FormControl("", Validators.required),
    })
  }

  login() {
    this.isLoading = true;

    if (this.formStatus === "Register") {
      this.subsLogin.sink = this.service.register(this.registerForm.value).subscribe(resp => {
        if (resp) {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Register Succesful',
          })
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      }, err => {
        Swal.fire({
          icon: 'error',
          title: err.message,
        })
        this.isLoading = false
      })
    }
    else{
      this.subsLogin.sink = this.service.login(this.username.value, this.password.value).subscribe(resp => {
        if (resp) {
          this.isLoading = false;
          localStorage.setItem('token', resp.data.getToken.message)
          localStorage.setItem('user_type', resp.data.getToken.user.role)
          localStorage.setItem('email', resp.data.getToken.user.email)
          Swal.fire({
            icon: 'success',
            title: 'Login Succesful',
          })
          setTimeout(() => {
            window.location.replace("/homepage")
          }, 1000)
          // this.router.navigate(['/menu'])
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

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.service.selectedLang = lang
  }

  changeSlide() {
    if (this.formStatus === "Login") {
      this.formStatus = "Register"
    }
    else {
      this.formStatus = "Login"
    }
  }

  forgetPassword() {
    this.dialog.open(ForgetPasswordComponent, {
      width: '500px',
    });
  }
}
