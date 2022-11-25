import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatDialog } from '@angular/material/dialog';
import { IngredientEditFormComponent } from '../ingredient-edit-form/ingredient-edit-form.component';
import Swal from 'sweetalert2'
import { FormControl } from '@angular/forms';


interface IDataTable {
  id: string
  name: string
  status: string | number
  stock: number
}

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.css']
})
export class StockManagementComponent implements OnInit {
  private subsIngredients = new SubSink();
  private subsDelete = new SubSink();
  private subsPagination = new SubSink();
  search_ingredient_name = new FormControl();
  isLoading = false
  page = 1
  search!: string
  max_page: number = 1
  dataIngredients: IDataTable[] = []
  dataSource = new MatTableDataSource(this.dataIngredients)
  displayedColumns: string[] = ['name', 'status', 'stock', 'operation'];
  displayedFilter: string[] = ['ingredient_name_filter'];


  constructor(private service: ApiServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subsPagination.sink = this.service.getAllIngredientsPagination(this.page, this.search).valueChanges.subscribe((resp: any) => {
      this.dataIngredients = resp.data.getAllIngredient.data
      this.dataSource = new MatTableDataSource(this.dataIngredients)
      this.max_page = resp.data.getAllIngredient.max_page
    })

    this.search_ingredient_name.valueChanges.subscribe((val) => {
      this.page = 1
      this.search = val
      this.subsPagination.sink = this.service.getAllIngredientsPagination(1, val).valueChanges.subscribe((resp: any) => {
        this.dataIngredients = resp.data.getAllIngredient.data
        this.dataSource = new MatTableDataSource(this.dataIngredients)
        this.max_page = resp.data.getAllIngredient.max_page
      })
      this.service.getAllIngredientsPagination(this.page, this.search).refetch()

    });
    this.service.getAllIngredientsPagination(this.page, this.search).refetch()
  }

  openDialog(action: string, name?: string, stock?: number, id?: any): void {
    // this.nextPage(this.max_page)
    this.dialog.open(IngredientEditFormComponent, {
      width: '250px',
      data: {
        action: action,
        id: id,
        name: name,
        stock: stock,
        page: this.page,
        search: this.search
      }
    });
  }

  onDelete(id: string) {

    Swal.fire({
      title: 'Do you want to delete?',
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      denyButtonText: `Yes`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        this.isLoading = true
        this.subsDelete.sink = this.service.deleteIngredient(id).subscribe(resp => {
          if (resp) {
            this.service.getAllIngredientsPagination(this.page, this.search).refetch()
            Swal.fire('Ingredient deleted')
            this.isLoading = false
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
    })
  }

  previousPage() {
    if (this.page > 1) {
      this.page--
      this.subsIngredients.sink = this.service.getAllIngredientsPagination(this.page, this.search).valueChanges.subscribe((resp: any) => {
        this.dataIngredients = resp.data.getAllIngredient.data
        this.dataSource = new MatTableDataSource(this.dataIngredients)
      })
      this.service.getAllIngredientsPagination(this.page, this.search).refetch()

    }
  }
  nextPage() {
    if (this.page < this.max_page) {
      this.page++
      this.subsIngredients.sink = this.service.getAllIngredientsPagination(this.page, this.search).valueChanges.subscribe((resp: any) => {
        this.dataIngredients = resp.data.getAllIngredient.data
        this.dataSource = new MatTableDataSource(this.dataIngredients)
      })
      this.service.getAllIngredientsPagination(this.page, this.search).refetch()
    }
  }
}


