import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateRecipeFormComponent } from '../create-recipe-form/create-recipe-form.component';
import copy from 'fast-copy';
import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from '@angular/forms';


interface IMenu {
  available: number
  highlight: boolean
  recipe_name: string
  img: string
  price: number
  description: string
  status: string
  extractedIngredient: string
  ingredients: Array<any>
}


@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {
  private subsMenuUpdate = new SubSink();
  private subsPagination = new SubSink();

  search_recipe_name = new FormControl();
  page = 1;
  max_page: number = 1
  search!: string
  isLoading = false;
  dataMenu: IMenu[] = []
  dataSource = new MatTableDataSource(this.dataMenu)
  dataMenu2: IMenu[] = []
  displayedColumns: string[] = ['recipe_name', 'description', 'ingredients', 'price', 'status', 'highlight','operation'];
  displayedFilter: string[] = ['recipe_name_filter'];


  constructor(private service: ApiServiceService, private dialog: MatDialog, private translate: TranslateService ) { }
  
  ngOnInit(): void {
    this.subsPagination.sink = this.service.getAllRecipesPagination(this.page, this.search).valueChanges.subscribe((resp: any) => {
      this.dataMenu = resp.data.getAllRecipes.data      
      this.dataMenu2 = this.service.extractIngredientsTable(this.dataMenu)
      this.dataSource = new MatTableDataSource(this.dataMenu2)
      this.max_page = resp.data.getAllRecipes.max_page
    })

    this.search_recipe_name.valueChanges.subscribe((val) => {
      this.page = 1
      this.search = val
      this.subsPagination.sink = this.service.getAllRecipesPagination(1, val).valueChanges.subscribe((resp: any) => {
        this.dataMenu = resp.data.getAllRecipes.data      
        this.dataMenu2 = this.service.extractIngredientsTable(this.dataMenu)
        this.dataSource = new MatTableDataSource(this.dataMenu2)
        this.max_page = resp.data.getAllRecipes.max_page
      })
      this.service.getAllRecipesPagination(this.page, this.search).refetch()
     });

    this.service.getAllRecipesPagination(this.page, this.search).refetch()
  }

  openDialog(): void {
    this.dialog.open(CreateRecipeFormComponent, {
      width: '250px',
      data: {
        action: 'submit',
        page: this.page,
        search: this.search
      }

    });
  }

  openDialogEdit(selectedCard: any, action: string): void {
    this.dialog.open(CreateRecipeFormComponent, {
      width: '250px',
      data: {
        selectedCard: selectedCard,
        action: action,
        page: this.page,
        search: this.search
      }

    });
  }

  editStatus(data: any) {

    data = copy(data)
    if (data.status === 'active') {
      data.status = 'unpublished'
    }
    else if (data.status === 'unpublished') {
      data.status = 'active'
    }
    else {
      data.status = 'unpublished'
    }
    Swal.fire({
      title: 'Do you want to edit status to ' + data.status + '?',
      showDenyButton: false,
      showCancelButton: true,
      showConfirmButton: true,
      denyButtonText: `Yes`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.isLoading = true
        this.subsMenuUpdate.sink = this.service.updateRecipeStatus(data).subscribe(resp => {
          if (resp) {
            this.isLoading = false
            this.service.getAllRecipesPagination(this.page, this.search).refetch()
            Swal.fire('Menu status has been changed to ' + data.status)
          }
        })
      }
    })
  }

  editHighlightedStatus(data: any){
    data = copy(data)
    if (data.highlight == true) {
      data.highlight = false
    }
    else if (data.highlight == false) {
      data.highlight = true
    }

    this.isLoading = true
    this.subsMenuUpdate.sink = this.service.updateRecipeHighlight(data).subscribe(resp => {
      if (resp) {
        this.isLoading = false
        this.service.getAllRecipesPagination(this.page, this.search).refetch()
      }
    })
  }

  deleteRecipe(data: any) {
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
        data = copy(data)
        data.status = 'deleted'
        this.subsMenuUpdate.sink = this.service.updateRecipeStatus(data).subscribe(resp => {
          if (resp) {
            this.service.getAllRecipesPagination(this.page, this.search).refetch()
            this.isLoading = false
            Swal.fire('Menu deleted')
          }
        })
      }
    })
  }

  previousPage(){
    if(this.page>1){
      this.page--
      this.subsPagination.sink = this.service.getAllRecipesPagination(this.page, this.search).valueChanges.subscribe((resp: any) => {
        this.dataMenu = resp.data.getAllRecipes.data
        this.dataMenu2 = this.service.extractIngredientsTable(this.dataMenu)
        this.dataSource = new MatTableDataSource(this.dataMenu2)
      })
      this.service.getAllRecipesPagination(this.page, this.search).refetch()
    }
  }
  nextPage(){

    if(this.page < this.max_page){
      this.page++
      this.subsPagination.sink = this.service.getAllRecipesPagination(this.page, this.search).valueChanges.subscribe((resp: any) => {
        this.dataMenu = resp.data.getAllRecipes.data
        this.dataMenu2 = this.service.extractIngredientsTable(this.dataMenu)
        this.dataSource = new MatTableDataSource(this.dataMenu2)
      }) 
      this.service.getAllRecipesPagination(this.page, this.search).refetch()
    }
  }
}

