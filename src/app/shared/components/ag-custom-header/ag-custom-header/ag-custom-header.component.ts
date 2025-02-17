import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

@Component({
  selector: 'app-ag-custom-header',
  templateUrl: './ag-custom-header.component.html',
  styleUrls: ['./ag-custom-header.component.scss']
})
export class AgCustomHeaderComponent implements IHeaderAngularComp {
  public params: any;
  public icon: string;
  public isChecked = false;
  agInit(params: any): void {
    // console.log(params)
    this.params = params;
    this.icon = params.headerIcon;
    this.isChecked = params.value
    this.params.api.addEventListener('rowSelected', this.onRowSelected.bind(this));

  }

  refresh(params: IHeaderParams): boolean {
    // console.log(params)
    this.params = params;
    return true;
  }
  public totalRows= []
  onChange(event: any) {
    // console.log(event)
    const checked = event.checked;
    this.isChecked = event.checked;
    this.params.api.forEachNode((node) => {
        node.setSelected(checked);
    });
  }

  onRowSelected(): void {
    this.totalRows = [];
    this.params.api.forEachNode((node) => {
      // console.log(node)
      if(node.selectable) {
        this.totalRows.push(node)
      } 
  });
    if(this.params.api.getSelectedRows().length == 0) {
      this.isChecked = false;
      return
    }
    this.isChecked = this.params.api.getSelectedRows().length == this.totalRows.length ? true : false
  }
}