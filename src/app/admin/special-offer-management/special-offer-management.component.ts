import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import copy from 'fast-copy';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-special-offer-management',
  templateUrl: './special-offer-management.component.html',
  styleUrls: ['./special-offer-management.component.css']
})
export class SpecialOfferManagementComponent implements OnInit {
  private subsPromo = new SubSink();
  isLoading = false;
  dataPromo: {}[] = []
  dataSource = new MatTableDataSource(this.dataPromo)
  displayedColumns: string[] = ['name', 'description', 'menu', 'status', 'operation'];

  constructor(private service: ApiServiceService) { }

  ngOnInit(): void {
    this.subsPromo.sink = this.service.getAllSpecialOffers(null).valueChanges.subscribe((resp: any) => {
      this.dataPromo = resp.data.getAllSpecialOffers.data
      this.dataSource = new MatTableDataSource(this.dataPromo)
    })
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
        this.subsPromo.sink = this.service.updateSpecialOffer(data).subscribe(resp => {
          if (resp) {
            this.isLoading = false
            this.service.getAllSpecialOffers("").refetch()
            Swal.fire('Promo status has been changed to ' + data.status)
          }
        })
      }
    })
  }

}
