import { Component, OnInit, Input,Output, OnChanges,EventEmitter, SimpleChange, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import {BehaviorSubject } from 'rxjs';
import {Observable} from 'rxjs/Rx'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Images} from '../../images/images.module';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnChanges {

  @Input() tableData: any;
  @Input() columns: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() trigger = new EventEmitter<object>();
  tableWidth: string;
  private images = Images;
   selectedBatch: object;
  displayedColumns = ['batch_nbr', 'mfd_date', 'exp_date', 'tot_qty','remain_quan'];
 
  blogDatabase: BlogDatabase | null;
  dataSource: GridDataSource | null;

  constructor() {
    //this.tableWidth = (this.displayedColumns.length * 150) + 'px';
  }

  

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if(!this.tableData && !this.columns) return;
    this.displayedColumns = this.columns;
    this.blogDatabase = new BlogDatabase(this.tableData);
    this.dataSource = new GridDataSource(this.blogDatabase);
  }

  goToComments(link): void{
    window.open(link, "_blank");
  }

  getInventoryDetails(data?: any): void{
    this.selectedBatch = data || {};
    this.trigger.emit(this.selectedBatch);
    // console.log(this.selectedBatch)
    
  }

}

export interface BlogData {
  batch_nbr: number;
  mfd_date: number;
  exp_date: number;
  remain_quan: number;
}

export class BlogDatabase {
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }
  
  constructor(private result: any) {
    result.map(list => {
      const copiedData = this.data.slice();
      copiedData.push(this.createNewUser(list));
      this.dataChange.next(copiedData);
    });
  }

  private createNewUser(list: any) {
    return list;
  }
}

export class GridDataSource extends DataSource<any> {
  constructor(private _blogDatabase: BlogDatabase) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._blogDatabase.dataChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._blogDatabase.data.slice();
      return data;
    });
  }

  disconnect() {}
}
