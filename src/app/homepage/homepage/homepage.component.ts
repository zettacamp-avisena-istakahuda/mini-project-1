import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { HostListener } from "@angular/core";
import copy from 'fast-copy';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  screenHeight!: number;
  screenWidth!: number;
  private subsPromo = new SubSink();
  private subsHighlight = new SubSink();
  dataPromo: any
  dataPromo2: any
  dataHighlight: any
  dataImages = { path: '', width: 0, height: 0 }
  dataImages2 = { path: '', width: 0, height: 0 }
  _images: any[] = []
  _images2: any[] = []
  constructor(private service: ApiServiceService) {
    this.getScreenSize()

  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = 0.75 * window.innerHeight;
    this.screenWidth = 0.8 * window.innerWidth;
  }

  ngOnInit(): void {
    this._images = []
    this._images2 = []
    this.subsPromo.sink = this.service.getAllSpecialOffers().valueChanges.subscribe((resp: any) => {
      this.dataPromo = resp.data.getAllSpecialOffers.data
      this.dataPromo2 = copy(this.dataPromo)

           
      for (let a of this.dataPromo) {
        this.dataPromo2.push(a)
      }
      for (let b of this.dataPromo2) {
        this._images2.push(this.dataImages2)
      }

      
    })

    this.subsHighlight.sink = this.service.getActiveMenu("", true, null).valueChanges.subscribe((resp: any) => {
      this.dataHighlight = resp.data.getActiveMenu.data;
      for (let a of this.dataHighlight) {
        this._images.push(this.dataImages)
      }
    })
    this.service.getActiveMenu("", true).refetch()
    this.service.getAllSpecialOffers().refetch()
  }

}
