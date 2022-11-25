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

    this.subsTransaction.sink = this.service.getAllTransactions('success', false, this.allUserName.value).valueChanges.subscribe((resp: any) => {
      this.dataTable = resp.data.getAllTransactions.data;
      this.dataSource = new MatTableDataSource(this.dataTable)
    })
  }

  onFilter() {
    console.log(this.allUserName.value)
    this.subsTransaction.sink = this.service.getAllTransactions('success', false, this.allUserName.value).valueChanges.subscribe((resp: any) => {
      this.dataTable = resp.data.getAllTransactions.data;
      this.dataSource = new MatTableDataSource(this.dataTable)
    })    
  }

}
