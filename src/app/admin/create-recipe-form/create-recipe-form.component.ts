import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms'
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SubSink } from 'subsink';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import copy from 'fast-copy';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-create-recipe-form',
  templateUrl: './create-recipe-form.component.html',
  styleUrls: ['./create-recipe-form.component.css']
})
export class CreateRecipeFormComponent implements OnInit {
  isLoading = false

  createRecipe: any
  selectedRecipeID!: string
  private subsIngredients = new SubSink();
  dataIngredients: any = []
  ingredientsToChoose: any = []
  constructor(
    private dialog: MatDialogRef<CreateRecipeFormComponent>,
    private service: ApiServiceService,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.subsIngredients.sink = this.service.getAllIngredients().valueChanges.subscribe((resp: any) => {
      this.dataIngredients = resp.data.getAllIngredient.data
      this.ingredientsToChoose = copy(this.dataIngredients)

    })

    this.createRecipe = new FormGroup({
      'recipe_name': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'img': new FormControl(null, Validators.required),
      'price': new FormControl(null, Validators.required),
      input: this.fb.array([]),
    })
    if (this.data.action === 'edit') {
      let i = 0
      this.selectedRecipeID = this.data.selectedCard.id
      this.data.selectedCard = copy(this.data.selectedCard)
      this.data.selectedCard.input = this.data.selectedCard.ingredients
      delete this.data.selectedCard.ingredients;
      delete this.data.selectedCard.id;
      delete this.data.selectedCard.status;
      delete this.data.selectedCard.available;
      delete this.data.selectedCard.__typename;

      for (let a of this.data.selectedCard.input) {
        this.data.selectedCard.input[i].ingredient_id = this.data.selectedCard.input[i].ingredient_id.id;
        delete this.data.selectedCard.input[i].__typename;
        this.addInput()
        i++;
      }
      console.log(this.data.selectedCard)
      this.createRecipe.patchValue(this.data.selectedCard)
    }
    else {
      this.addInput()
    }
  }

  get input(): FormArray {
    return this.createRecipe.get("input") as FormArray
  }


  newInput(): FormGroup {
    return this.fb.group({
      ingredient_id: [null, Validators.required],
      stock_used: [null, Validators.required],
    })
  }

  addInput() {
    this.input.push(this.newInput());
  }

  removeInput(i: number) {
    this.input.removeAt(i);
    this.onCheckIngredient()
  }

  onSubmit() {

    if (this.createRecipe.valid) {
      this.isLoading = true
      if (this.data.action == 'edit') {
        this.subsIngredients.sink = this.service.updateRecipe(this.createRecipe.value, this.selectedRecipeID).subscribe(resp => {
          if (resp) {
            this.service.getAllRecipesPagination(this.data.page, this.data.search, this.data.sortPrice).refetch()
            this.isLoading = false
            Swal.fire({
              icon: 'success',
              title: 'Menu has been successfully edited',
            })
            this.dialog.close()
          }
        }, err => {
          Swal.fire({
            icon: 'error',
            title: err.message,
          })
          this.isLoading = false
        })
      }
      else {
        this.subsIngredients.sink = this.service.createRecipe(this.createRecipe.value).subscribe(resp => {
          if (resp) {
            this.service.getAllRecipesPagination(this.data.page, this.data.search, this.data.sortPrice).refetch()
            this.isLoading = false
            Swal.fire({
              icon: 'success',
              title: 'Menu has been successfully submitted',
            })
            this.dialog.close()
          }
        }, err => {
          Swal.fire({
            icon: 'error',
            title: err.message,
          })
          this.isLoading = false
        })
      }
    }

    else {
      Swal.fire({
        icon: 'error',
        title: 'Need to fill all the required forms',
      })
    }
  }

  onCheckIngredient() {
    this.ingredientsToChoose = copy(this.dataIngredients)
    for (let b of this.createRecipe.value.input) {
      let i = 0
      for (let c of this.ingredientsToChoose) {
        if (c.id === b.ingredient_id) {
          this.ingredientsToChoose[i].choosenStatus = true
        }
        i++
      }
    }
  }

  onClose(){
    this.dialog.close()
  }

}
