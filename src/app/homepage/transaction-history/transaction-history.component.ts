import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common'
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  @ViewChild('TABLE') table!: ElementRef;
  private subsUser = new SubSink();
  private subsTransaction = new SubSink();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  totalIncome!: number
  page = 1;
  max_page: number = 1
  allUserName = new FormControl();
  dateStart = new FormControl();
  dateEnd = new FormControl();
  lastDays = new FormControl();
  lastDays2!: string | null
  clockStart = new FormControl("00:01");
  clockEnd = new FormControl("23:55");
  dataTable: any = []
  dataUser!: any
  dataSource = new MatTableDataSource(this.dataTable)
  displayedColumns: string[] = ['order_time', 'name', 'item_name', 'amount', 'price'];
  displayedFilter: string[] = ['total_order', 'total_order2'];
  constructor(private service: ApiServiceService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.subsUser.sink = this.service.getAllUsers().valueChanges.subscribe((resp: any) => {
      this.dataUser = resp.data.getAllUsers.data;

    })

    this.subsTransaction.sink = this.service.getAllTransactions('success', false,
      this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value), this.lastDays.value).valueChanges.subscribe((resp: any) => {
        this.dataTable = resp.data.getAllTransactions.data;
        this.totalIncome = this.countTotalIncome(this.dataTable);
        
        this.dataSource = new MatTableDataSource(this.dataTable)
        this.max_page = resp.data.getAllTransactions.max_page;
      })
    this.service.getAllTransactions('success', false,
      this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value), this.lastDays.value).refetch()


    this.allUserName.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    this.dateStart.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    this.dateEnd.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    this.clockStart.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    this.clockEnd.valueChanges.subscribe((val) => {
      this.onFilter()
    });
    this.lastDays.valueChanges.subscribe((val) => { 
       if(val.length > 1){
        this.lastDays2 = val[1];
       }    
       else if(val.length ==1 ){
        this.lastDays2 = val[0];
       }        
       else{
        this.lastDays2 = null
       }
      this.onFilter()
    });

  }

  onFilter() {
    this.page = 1
    this.subsTransaction.sink = this.service.getAllTransactions('success', false,
      this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value), this.lastDays2).valueChanges.subscribe((resp: any) => {
        this.dataTable = resp.data.getAllTransactions.data;
        this.totalIncome = this.countTotalIncome(this.dataTable);
        this.dataSource = new MatTableDataSource(this.dataTable)
        this.max_page = resp.data.getAllTransactions.max_page;
      })
    this.service.getAllTransactions('success', false,
      this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value), this.lastDays2).refetch()
  }

  previousPage() {
    if (this.page > 1) {
      this.page--
      this.subsTransaction.sink = this.service.getAllTransactions('success', false,
        this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value), this.lastDays2).valueChanges.subscribe((resp: any) => {
          this.dataTable = resp.data.getAllTransactions.data;
          this.totalIncome = this.countTotalIncome(this.dataTable);
          this.dataSource = new MatTableDataSource(this.dataTable)
        })
      this.service.getAllTransactions('success', false,
        this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value), this.lastDays2).refetch()
    }
  }

  nextPage() {
    if (this.page < this.max_page) {
      this.page++
      this.subsTransaction.sink = this.service.getAllTransactions('success', false,
        this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value), this.lastDays2).valueChanges.subscribe((resp: any) => {
          this.dataTable = resp.data.getAllTransactions.data;
          this.totalIncome = this.countTotalIncome(this.dataTable);
          this.dataSource = new MatTableDataSource(this.dataTable)
        })
      this.service.getAllTransactions('success', false,
        this.allUserName.value, this.page, this.dateStartProcess(this.dateStart.value), this.dateEndProcess(this.dateEnd.value), this.lastDays2).refetch()
    }
  }

  dateStartProcess(val: string) {
    if (val) {
      return (this.datePipe.transform(val, 'yyyy-MM-dd') + "T" + this.clockStart.value + ":00+07:00");
    }
    else {
      return ""
    }
  }

  dateEndProcess(val: string) {
    if (val) {
      return (this.datePipe.transform(val, 'yyyy-MM-dd') + "T" + this.clockEnd.value + ":00+07:00");
    }
    else {
      return ""
    }
  }

  ExportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'DataTransaksi.xlsx');
  }

  countTotalIncome(data:any){
     let total = 0  
     for (let a of data){
         total = total + a.totalPrice         
     }
     return total
  }

  toggleChange(event: any) {
    let toggle = event.source;
    if (toggle) {
        let group = toggle.buttonToggleGroup;
        if (event.value.some((item: any) => item == toggle.value)) {
            group.value = [toggle.value];
        }
    }
}

}
