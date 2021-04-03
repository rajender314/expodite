import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {

  selectedShipment: object;
  updatedShipmentDetails: object;

  constructor() { }

  ngOnInit() {
  }

  getSelectedShipment(data: any): void {
    if (data) 
    this.selectedShipment = data;
    else 
    this.selectedShipment = {};
  }

  updateDetails(result): void {
    this.updatedShipmentDetails = {
      id: result.flag,
      result: result.data
    }
  }

}