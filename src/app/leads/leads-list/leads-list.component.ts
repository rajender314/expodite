import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnakbarService } from '../../services/snakbar.service';
import { Title } from '@angular/platform-browser';

import * as _ from 'lodash';
import { LeadsService } from '../leads.service';
import { Router } from '@angular/router';
import { AddLeadDialogComponent } from '../add-lead-dialog/add-lead-dialog.component';


@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss']
})
export class LeadsListComponent implements OnInit {
  public rowData = [];
  columnDefs = [];
  gridApi: any;
  public datalngth:any;
  public noRowsTemplate;
  public loadingTemplate;
  fetchingData = true;
  timeOutRef:any;
  constructor(private titleService: Title,
    private dialog: MatDialog, public service: LeadsService,
     private route: Router) { 
      
     }

  ngOnInit(): void {
    this.titleService.setTitle("Expodite - Leads");
    this.getLeadsList(true);
   
  }

  getLeadsList(isFirstTime?): void {
    this.fetchingData = true;
    this.service
      .getStores()
      .then(response => {
        this.fetchingData = false;

        if (response.result.success) {
          
          this.rowData =response.result.data.data;
          if(this.rowData.length){
            this.datalngth =true
          }else{
            this.timeOutRef = setTimeout(() => {
            this.datalngth =false
            })
          }
          if (isFirstTime) {
            this.columnDefs = [{ field: 'lead_id', headerName: 'Lead ID' }];
            Object.keys(response.result.data.headers).forEach(key => {
              
              this.columnDefs.push({
                field: key,
                headerName: response.result.data.headers[key].name,
                tooltipField:key ,
                rowClass:'p',
                cellClass:key == "priority_558932"?'align-right wdth':'p' ,
                cellWidth:key == "priority_558932"?'100':'',
                
              });
              
              
            });
            this.loadingTemplate =
            `<span class="ag-overlay-loading-center">data is loading...</span>`;
          this.noRowsTemplate =
            `"<span">123</span>"`;
            console.log(this.columnDefs)
          }
        }
        else;
      })
      .catch(error => console.log(error))
  }

  onGridReady(e) {
    this.gridApi = e.api;
    // this.gridApi.sizeColumnsToFit();
  }

  onRowClicked(p) {
    if (p.data) {
      this.route.navigate(['leads/details/' + p.data.id]);
    }
  }

  addLead(): void {
    //this.timeOutRef = setTimeout(() => {
    let dialogRef = this.dialog.open(AddLeadDialogComponent, {
      panelClass: 'alert-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getLeadsList();
      }
    });
  }
}
