import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})

export class ContainersComponent implements OnInit {

  selectedContainer: object;
  updatedContainersDetails: object;

  constructor() { }

  ngOnInit() {
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
