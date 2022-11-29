import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { HostListener } from "@angular/core";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  screenHeight!: number;
  screenWidth!: number;
  private subsHighlight = new SubSink();
  dataHighlight: any
  dataImages = { path: '', width: 0, height: 0 }
  _images: any[] = []
  constructor(private service: ApiServiceService) {
    this.getScreenSize()

  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = 0.8 * window.innerHeight;
    this.screenWidth = 0.8 * window.innerWidth;
  }

  ngOnInit(): void {
    this._images = []
    this.subsHighlight.sink = this.service.getActiveMenu("", true).valueChanges.subscribe((resp: any) => {
      this.dataHighlight = resp.data.getActiveMenu.data;
      for (let a of this.dataHighlight) {
        this._images.push(this.dataImages)
      }
    })
    this.service.getActiveMenu("", true).refetch()
  }

}
