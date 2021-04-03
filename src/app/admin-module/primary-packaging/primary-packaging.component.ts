import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-primary-packaging',
  templateUrl: './primary-packaging.component.html',
  styleUrls: ['./primary-packaging.component.css']
})
export class PrimaryPackagingComponent implements OnInit {
  selectedContainer: object;
  updatedContainersDetails: object;

  constructor() { }

  ngOnInit(): void {
  }
  getSelectedContainer(data: any): void {
    if(data.status == undefined) {
      data.status = true;
    }
    if (data) 
    this.selectedContainer = data;
    else 
    this.selectedContainer = {};
  }

  updateDetails(result): void {
    this.updatedContainersDetails = {
      id: result.flag,
      delete: result.delete?result.delete:false,
      result: result.data
    }
  }
}
