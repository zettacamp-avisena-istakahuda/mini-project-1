import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2'
import copy from 'fast-copy';


interface ICartData {
  id: string
  available: number
  totalPrice: number
  menu: [
    {
      amount: number
      note: string
      recipe_id: {
        recipe_name: string | null
        img: string | null
      }
    }
  ]
}


@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  decreement!: any
  dataCart: ICartData[] = []
  isLoading = false
  totalCartPrice = 0
  private subsCartData = new SubSink();
  private subsOperation = new SubSink();
  private subsCheckout = new SubSink();


  constructor(private service: ApiServiceService) { }

  ngOnInit(): void {
    this.subsCartData.sink = this.service.getAllTransactions('pending', true).valueChanges.subscribe((resp: any) => {
      this.dataCart = resp.data.getAllTransactions.data
      this.totalCartPrice = this.totalPrice(resp.data.getAllTransactions.data)
    })
  }

  amountOperation(id: string, action: string, amount?: number, available?: number) {
    console.log(available);
    
    this.decreement = amount
    if (amount == 1 && action === 'pull') {

    }
    else if(amount==1 && available==1){
      Swal.fire({
        icon: 'error',
        title: 'Maaf stok tidak cukup ',
      })
    }
    else if (amount == available! && action === 'push') {
      Swal.fire({
        icon: 'error',
        title: 'Maaf stok tidak cukup ',
      })
    }
    else {
      this.isLoading = true
      this.subsOperation.sink = this.service.updateTransaction(id, action).subscribe((resp: any) => {
        if (resp) {
          this.service.getAllTransactions('pending', true).refetch()
          this.isLoading = false
        }
        else {
          this.isLoading = false
        }
      })
    }
  }

  checkout() {
    this.isLoading = true;
    this.subsCheckout.sink = this.service.checkout().subscribe((resp: any) => {
      if (resp) {
        Swal.fire({
          icon: 'success',
          title: 'Pesananmu lagi diproses. Ditunggu ya',
        })
        this.isLoading = false;
        this.service.getAllTransactions('pending', true).refetch()
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

  totalPrice(data: any) {
    let totalPrice = 0
    for (let a of data) {
      totalPrice = totalPrice + a.totalPrice
    }
    return totalPrice
  }

  async onEditNote(id: string, noteText: string) {
    const { value: note = noteText } = await Swal.fire({
      title: 'Kalau ada request, kabarin disini ya',
      input: 'text',
      inputValue: noteText,
    })
    if (note || note==="") {
      this.isLoading = true
      this.subsOperation.sink = this.service.updateTransactionNote(id, note).subscribe((resp: any) => {
        if (resp) {
          this.service.getAllTransactions('pending', true).refetch()
          this.isLoading = false
        }
      })
    }
  }

}
