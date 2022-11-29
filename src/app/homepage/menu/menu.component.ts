import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { LoginFormComponent } from 'src/app/login/login-form/login-form.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormControl } from '@angular/forms';
import copy from 'fast-copy';
import { Router } from '@angular/router';


interface IMenu {
  id: string
  available: number
  recipe_name: string
  img: string
  price: number
  description: string
  ingredients: Array<any>
}

interface IOrder {
  recipe_id: string
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private subsPromo = new SubSink();
  private subsOrder = new SubSink();
  private subsCart = new SubSink();


  search_menu_name = new FormControl();

  isLoading = false;
  login!: string | null
  cartAmount = 0

  search!: string
  dataCartAdded: any = []
  dataMenu: any = []
  dataOrder: IOrder[] = []
  ingredients: Array<string> = []
  constructor(private service: ApiServiceService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {

  

    this.subsPromo.sink = this.service.getActiveMenu(this.search).valueChanges.subscribe((resp: any) => {
      this.dataMenu = resp.data.getActiveMenu.data
      this.dataMenu = copy(this.dataMenu)
      this.ingredients = this.service.extractIngredients(this.dataMenu)
      this.login = localStorage.getItem('token')
      if (this.login) {
        this.subsCart.sink = this.service.getAllTransactions('pending', true).valueChanges.subscribe((resp: any) => {
          this.cartAmount = resp.data.getAllTransactions.data.length
          this.dataCartAdded = resp.data.getAllTransactions.data;
          this.cartStatus()
        })
      }
    })



    this.search_menu_name.valueChanges.subscribe((val) => {
      this.search = val
      this.subsPromo.sink = this.service.getActiveMenu(this.search).valueChanges.subscribe((resp: any) => {
        this.dataMenu = resp.data.getActiveMenu.data
        this.ingredients = this.service.extractIngredients(this.dataMenu)
      })
    });
    this.service.getActiveMenu(this.search).refetch()

  }

  onAddCart(id: string) {
    if (this.login) {
      this.isLoading = true;
      this.subsOrder.sink = this.service.createTransaction(id).subscribe((resp: any) => {
        if (resp) {
          this.service.getAllTransactions('pending', true).refetch()
          this.isLoading = false;
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Menu succesfully added to cart',
            showConfirmButton: false,
            timer: 1000
          })
        }
      })
    }
    else {
      Swal.fire({
        position:'top',
        title: 'Login dulu ya'
      })
      this.router.navigate(['login'])
    }
  }

  openDialog(): void {
    this.dialog.open(LoginFormComponent, {
      width: '250px',
      panelClass: 'custom-modalbox',
    });
  }

  cartStatus() {
    for (let a of this.dataCartAdded) {            
      let i = 0;
      for (let b of this.dataMenu) {        
        if (a.menu[0].recipe_id.id === b.id) {
          this.dataMenu[i].cartStatus = true
        }
        i++;
      }
    }    
  }

   onCart(id: string) {
    Swal.fire({
      title: '',
      showCancelButton: true,
      showConfirmButton: true,
      input: 'number'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        
      }
    })
  }

}




