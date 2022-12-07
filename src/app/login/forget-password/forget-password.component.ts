import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
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
  firstFormGroup: FormGroup = this._formBuilder.group({firstCtrl: ['']});
  secondFormGroup: FormGroup = this._formBuilder.group({secondCtrl: ['']});
  thirdFormGroup: FormGroup = this._formBuilder.group({thirdCtrl: ['']});

  isEditable = false;

  constructor(private _formBuilder: FormBuilder, public service: ApiServiceService) { }

  ngOnInit(): void {
    this.forgetForm = new FormGroup({
      'email': new FormControl("", Validators.email),
      'answer': new FormControl("", Validators.required),
      'newPassword': new FormControl(""),
      'newPassword2': new FormControl(""),

    })
  }

  goForward(stepper: MatStepper, step: number) {
    if (step == 1) {
      this.subsForget.sink = this.service.forgotPassword(this.forgetForm.value).subscribe((resp: any) => {
        if (resp) {
          this.security_question = resp.data.forgotPassword.security_question;
          stepper.next();
        }
      }, err => {
        Swal.fire({
          icon: 'error',
          title: err.message,
        })
      })
    }

    else if (step == 2) {
      
      this.subsForget2.sink = this.service.forgotPassword(this.forgetForm.value).subscribe((resp: any) => {
        if (resp) {
          stepper.next();
        }
      }, err => {
        Swal.fire({
          icon: 'error',
          title: err.message,
        })
      })
    }

    else{
      this.dataChangePassword.email = this.forgetForm.value.email
      this.dataChangePassword.password = ""
      this.dataChangePassword.newPassword1 = this.forgetForm.value.newPassword
      this.subsForget3.sink = this.service.changePassword(this.dataChangePassword, true).subscribe((resp: any) => {
        if (resp) {
          Swal.fire({
            icon: 'success',
            title: 'Password Succesfully Changed!',
          })
        }
      })
    }
  }

}
