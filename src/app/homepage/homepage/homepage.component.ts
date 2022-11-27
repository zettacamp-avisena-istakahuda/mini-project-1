import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
test = ["1", "2", "3"]
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
