import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-ingredient-edit-form',
  templateUrl: './ingredient-edit-form.component.html',
  styleUrls: ['./ingredient-edit-form.component.css']
})
export class IngredientEditFormComponent implements OnInit {
  name = new FormControl(null, Validators.required);
  stock = new FormControl(null, Validators.required);
  isLoading = false

  private subsForm = new SubSink();

  constructor(private service: ApiServiceService,
    private dialog: MatDialogRef<IngredientEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.name.setValue(this.data.name)
    this.stock.setValue(this.data.stock)

  }

  onSubmit() {
    if (this.name.valid && this.stock.valid) {
      this.isLoading = true
      if (this.data.action == 'add') {
        this.subsForm.sink = this.service.addIngredient(this.name.value, this.stock.value).subscribe(resp => {
          if (resp) {
            this.service.getAllIngredientsPagination(this.data.page,this.data.search).refetch()
            this.isLoading = false
            Swal.fire({
              icon: 'success',
              title: 'Ingredient has been successfully added',
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

      else if (this.data.action == 'edit') {
        this.subsForm.sink = this.service.updateIngredient(this.data.id, this.name.value, this.stock.value).subscribe(resp => {
          if (resp) {
            this.service.getAllIngredientsPagination(this.data.page,this.data.search).refetch()
            this.isLoading = false
            Swal.fire({
              icon: 'success',
              title: 'Menu has been successfully edited',
            })
            this.dialog.close()
          }
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

  onClose(){
    this.dialog.close()
  }

}
