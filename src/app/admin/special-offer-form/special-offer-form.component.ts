import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import copy from 'fast-copy';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SubSink } from 'subsink';

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
      let i = 0
      for (let a of this.data.menuDiscount) {
        this.data.menuDiscount[i].discount = a.recipe_id.discountAmount
        this.data.menuDiscount[i].recipe_id = a.recipe.id.id
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
    this.subsPromo.sink = this.service.createSpecialOffer(this.createPromo.value).subscribe(resp => {
      if (resp) {
        this.service.getAllSpecialOffers(null).refetch()
      }
    })

  }

}
