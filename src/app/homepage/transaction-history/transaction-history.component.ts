import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  private subsUser = new SubSink();
  private subsTransaction = new SubSink();

  page = 1;
  max_page: number = 1
  allUserName = new FormControl();
  dataTable: any = []
  dataUser!: any
  dataSource = new MatTableDataSource(this.dataTable)
  displayedColumns: string[] = ['order_time', 'name', 'item_name', 'amount'];
  constructor(private service: ApiServiceService) { }

  ngOnInit(): void {
    this.subsUser.sink = this.service.getAllUsers().valueChanges.subscribe((resp: any) => {
      this.dataUser = resp.data.getAllUsers.data;

    })

    this.subsTransaction.sink = this.service.getAllTransactions('success', false, this.allUserName.value, this.page).valueChanges.subscribe((resp: any) => {
      this.dataTable = resp.data.getAllTransactions.data;
      this.dataSource = new MatTableDataSource(this.dataTable)
      this.max_page = resp.data.getAllTransactions.max_page;
    })
  }

  onFilter() {
    this.max_page = 1
    this.subsTransaction.sink = this.service.getAllTransactions('success', false, this.allUserName.value, this.page).valueChanges.subscribe((resp: any) => {
      this.dataTable = resp.data.getAllTransactions.data;
      console.log(this.dataTable);
      
      this.dataSource = new MatTableDataSource(this.dataTable)
      this.max_page = resp.data.getAllTransactions.max_page;
    })
    this.service.getAllTransactions('success', false, this.allUserName.value, this.page).refetch()
  }

  previousPage() {
    if (this.page > 1) {
      this.page--
      this.subsTransaction.sink = this.service.getAllTransactions('success', false, this.allUserName.value, this.page).valueChanges.subscribe((resp: any) => {
        this.dataTable = resp.data.getAllTransactions.data;
        this.dataSource = new MatTableDataSource(this.dataTable)
      })
      this.service.getAllTransactions('success', false, this.allUserName.value, this.page).refetch()
    }
  }

  nextPage() {
    if (this.page < this.max_page) {
      this.page++
      this.subsTransaction.sink = this.service.getAllTransactions('success', false, this.allUserName.value, this.page).valueChanges.subscribe((resp: any) => {
        this.dataTable = resp.data.getAllTransactions.data;
        this.dataSource = new MatTableDataSource(this.dataTable)
      })
      this.service.getAllTransactions('success', false, this.allUserName.value, this.page).refetch()
    }
  }

}
