import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import copy from 'fast-copy';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-special-offer-form',
  templateUrl: './special-offer-form.component.html',
  styleUrls: ['./special-offer-form.component.css']
})
export class SpecialOfferFormComponent implements OnInit {
  isLoading = false
  createPromo: any
  menu: any
  private subsPromo = new SubSink()
  private subsMenu = new SubSink()
  constructor(
    private service: ApiServiceService,
    public fb: FormBuilder,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.createPromo = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      menuDiscount: this.fb.array([]),
    })

    if (this.data) {
      this.data = copy(this.data);
      console.log(this.data);

      let i = 0
      for (let a of this.data.menuDiscount) {
        this.data.menuDiscount[i].discount = a.recipe_id.discountAmount
        this.data.menuDiscount[i].recipe_id = a.recipe_id.id
        this.addInput()
        i++
      }
      this.createPromo.patchValue(this.data)
    }
    else {
      this.addInput()
    }

    this.subsMenu.sink = this.service.getAllRecipes().valueChanges.subscribe((resp: any) => {
      if (resp) {
        this.menu = resp.data.getAllRecipes.data;
      }
    })


  }

  get menuDiscount(): FormArray {
    return this.createPromo.get("menuDiscount") as FormArray
  }

  newInput(): FormGroup {
    return this.fb.group({
      recipe_id: [null, Validators.required],
      discount: [null, Validators.required]
    })
  }

  addInput() {
    this.menuDiscount.push(this.newInput());
  }
  removeInput(i: number) {
    this.menuDiscount.removeAt(i);
  }

  onCheckMenu() {
    console.log(this.createPromo.value)

  }

  onSubmit() {

    if (this.data) {

    }
    
    else {
      this.subsPromo.sink = this.service.createSpecialOffer(this.createPromo.value).subscribe(resp => {
        if (resp) {
          this.service.getAllSpecialOffers(null).refetch()
        }
      },err => {
        Swal.fire({
          icon: 'error',
          title:this.translate.instant(`warmindo.${err.message}`),
        })
        this.isLoading = false
      })
    }


  }

}
