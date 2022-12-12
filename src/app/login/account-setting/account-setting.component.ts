import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SubSink } from 'subsink';
import copy from 'fast-copy';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  private subsForm = new SubSink();
  private subsUpdate = new SubSink();
  private subsChangePassword = new SubSink();
  private subsLogOut = new SubSink();
  public lodash = require('lodash');
  changePassword = false
  changeForm = true
  passwordValid = false
  settingForm: any
  imgURL!: String
  postForm: any
  constructor(public service: ApiServiceService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.settingForm = new FormGroup({
      'avatarURL': new FormControl(""),
      'frontName': new FormControl(""),
      'lastName': new FormControl(""),
      'email': new FormControl(""),
      'password': new FormControl(""),
      'newPassword1': new FormControl(""),
      'newPassword2': new FormControl(""),
    })
    this.subsForm.sink = this.service.getOneUser().valueChanges.subscribe((resp: any) => {
      if (resp) {
        this.settingForm.controls['frontName'].setValue(resp.data.getOneUser.first_name)
        this.settingForm.controls['lastName'].setValue(resp.data.getOneUser.last_name)
        this.settingForm.controls['email'].setValue(resp.data.getOneUser.email)
        this.imgURL = resp.data.getOneUser.img
        this.postForm = this.settingForm.value
      }
    })

    this.settingForm.controls['newPassword1'].valueChanges.subscribe((resp: any) => {
      if (resp.length > 0) {
        this.changePassword = true

      }
      else if (resp.length < 1) {
        this.changePassword = false
        this.settingForm.controls['newPassword2'].setValue("")
        this.settingForm.controls['password'].setValue("")

      }
    })

    this.settingForm.controls['avatarURL'].valueChanges.subscribe((resp: any) => {

      if (resp) {
        this.imgURL = resp        
      }

    })

  }




  saveChanges() {

    this.settingForm.value.avatarURL = this.imgURL

    let a = copy(this.postForm)
    let b = copy(this.settingForm.value)
    delete a.newPassword1
    delete b.newPassword1
    delete a.newPassword2
    delete b.newPassword2
    delete a.password
    delete b.password

    if (this.settingForm.controls['newPassword1'].value === "") {
      //edit without password
      this.subsUpdate.sink = this.service.updateUser(this.settingForm.value).subscribe((resp: any) => {
        if (resp) {
          if (!this.lodash.isEqual(this.postForm.email, this.settingForm.value.email)) {
            localStorage.setItem('email', this.settingForm.value.email)
            this.subsLogOut.sink = this.service.logout().subscribe((resp: any) => {
              if (resp) {
                this.showSwal()
                localStorage.clear()
                window.location.replace("/login")
              }
            })
          }
          else {
            this.showSwal()
            this.service.getOneUser().refetch()
          }
        }
      })
    }

    else if (!this.lodash.isEqual(a, b) && this.settingForm.controls['newPassword1'].value !== "") {
      // edit both
      this.subsUpdate.sink = this.service.updateUser(this.settingForm.value).subscribe((resp: any) => {
        if (resp) {
          this.service.getOneUser().refetch()
          localStorage.setItem('email', this.settingForm.value.email)
          this.subsChangePassword.sink = this.service.changePassword(this.settingForm.value, false).subscribe((resp: any) => {
            if (resp) {
              this.subsLogOut.sink = this.service.logout().subscribe((resp: any) => {
                if (resp) {
                  this.showSwal()
                  localStorage.clear()
                  window.location.replace("/login")
                }
              })
            }
          }, err => {
            Swal.fire({
              icon: 'error',
              title: this.translate.instant(`warmindo.${err.message}`),
            })
          })
        }
      })
    }

    else {
      //edit just password
      console.log("edit just password");
      this.subsLogOut.sink = this.service.logout().subscribe((resp: any) => {
        if (resp) {
          this.showSwal()
          localStorage.clear()
          window.location.replace("/login")
        }
      }, err => {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant(`warmindo.${err.message}`),
        })
      })
    }
  }

  showSwal() {
    Swal.fire({
      icon: 'success',
      title: 'Data changed succesfully',
      timer: 2000
    })
  }

}
