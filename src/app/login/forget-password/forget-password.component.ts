import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: any
  security_question!: string
  dataChangePassword = {
    email: "",
    password: "",
    newPassword1: ""
  }
  private subsForget = new SubSink();
  private subsForget2 = new SubSink();
  private subsForget3 = new SubSink();
  isLoading = false;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = false;

  constructor(
    private _formBuilder: FormBuilder, 
    public service: ApiServiceService,
    private translate: TranslateService,
    private dialog: MatDialogRef<ForgetPasswordComponent>,
    ) { }

  ngOnInit(): void {
    this.forgetForm = new FormGroup({
      'email': new FormControl("", Validators.email),
      'token': new FormControl("", Validators.required),
      'newPassword': new FormControl(null),
      'newPassword2': new FormControl(""),

    })
  }

  goForward(stepper: MatStepper, step: number) {
    if (step == 1) {
      this.isLoading = true
      this.subsForget.sink = this.service.reqTokenByEmail(this.forgetForm.value).subscribe((resp: any) => {
        if (resp) {
          this.firstFormGroup.controls['firstCtrl'].setValue('x')
          stepper.next();
          this.isLoading = false
        }
      }, err => {
        Swal.fire({
          icon: 'error',
          title:this.translate.instant(`warmindo.${err.message}`),
        })
        this.isLoading = false
      })
    }

    else if (step == 2) {
      
      this.subsForget2.sink = this.service.forgotPassword(this.forgetForm.value).subscribe((resp: any) => {
        if (resp) {
          this.secondFormGroup.controls['secondCtrl'].setValue('x')
          this.isLoading = false
          stepper.next();
        }
      }, err => {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant(`warmindo.${err.message}`),
        })
        this.isLoading = false
      })
    }

    else{
      this.dataChangePassword.email = this.forgetForm.value.email
      this.dataChangePassword.password = ""
      this.dataChangePassword.newPassword1 = this.forgetForm.value.newPassword
      this.subsForget3.sink = this.service.forgotPassword(this.forgetForm.value).subscribe((resp: any) => {
        if (resp) {
          this.isLoading = false
          Swal.fire({
            icon: 'success',
            title: 'Password Succesfully Changed!',
          })
          setTimeout(() => {
            this.dialog.close()
          }, 1000)
        }
      })
    }
  }

}
