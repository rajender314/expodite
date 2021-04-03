import { LogService } from './../services/log.service';
import { Component, OnInit, EventEmitter, Output, Input, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  @Input() pageLimit;
  @Output() pageloadMore = new EventEmitter<object>();
  totalPages: number;
  params = {
    page: 1,
    perPage: 12,
    sort: 'ASC',
    search: ''
  };
  numbers = [];
  public minLimit: number;
  public maxLimit: number;
  public active = [];
  public displayRange: number;
  public calculateCount = true;
  public urlPath;
  public UpdateUser: any;
  public pageCount;
  constructor(private activatedRoute: ActivatedRoute,
    private logger: LogService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(url => {
      this.urlPath = url[0] ? url[0].path : ''; 
    });
    // console.log(this.activatedRoute)
   
    setTimeout(() => {
      this.calculatePagesCount();
    }, 1000);

  }

  ngOnChanges(changes: SimpleChange): void {
    this.calculateCount = true;
    this.calculatePagesCount(); 
  }

  calculatePagesCount() {
    if (this.calculateCount) {
      this.numbers = [];
      this.pageCount = this.pageLimit / this.params.perPage; 
      this.pageCount = Math.ceil(this.pageCount);
      // console.log(this.pageCount)

      for (let i = 1; i <= this.pageCount; i++) {
        this.numbers.push(i);
        this.active[i] = false;
      }
      this.active[1] = true;
      this.minLimit = 0;
      this.displayRange = 5;
      this.maxLimit = this.minLimit + this.displayRange;
    }
    this.calculateCount = false;
  }

  loadMore(param) {
    let num = param;
    let indx;
    for (let i = 1; i <= this.numbers.length; i++) {
      if (this.active[i] === true) {
        indx = i;
      }
    }
    if (param === 'prev') {
      num = indx - 1;
    }
    if (param === 'next') {
      num = indx + 1;
    }
    for (let i = 1; i <= this.numbers.length; i++) {
      this.active[i] = false;
    }
    if (num === 1) {
      this.minLimit = num - 1;
    } else if (num === this.numbers.length) {
      this.minLimit = num - this.displayRange;
    } else {
      this.minLimit = num - 2;
    }
    this.maxLimit = this.minLimit + this.displayRange;
    if (this.maxLimit > this.numbers.length) {
      this.minLimit = this.numbers.length - this.displayRange;
    }
    this.minLimit = this.minLimit < 0 ? 0 : this.minLimit;
    this.active[num] = !this.active[num];
    // if (this.params.page === num) {
    //   return 0;
    // }
    this.params.page = num;
    if (this.urlPath == 'users') {
      this.pageloadMore.emit(this.params);
    }
    if (this.urlPath == 'roles') {
      this.pageloadMore.emit(this.params);
    }
    if (this.urlPath == 'category') {
      this.pageloadMore.emit(this.params);
    }
    if (this.urlPath == 'products') {
      this.pageloadMore.emit(this.params);
    }
    if (this.urlPath == 'containers') {
      this.pageloadMore.emit(this.params);
    }
    if (this.urlPath == 'shipments') {
      this.pageloadMore.emit(this.params);
    }
    if (this.urlPath == 'address') {
      this.pageloadMore.emit(this.params);
    }
    if (this.urlPath == 'clients') {
      this.pageloadMore.emit(this.params);
    }
    
    if (this.activatedRoute['_routerState'].snapshot.url == '/inventory') {
      this.params.perPage = 12;
      this.pageloadMore.emit(this.params);
    }
    if (this.activatedRoute['_routerState'].snapshot.url == '/invoices') {
      this.params.perPage = 12;
      this.pageloadMore.emit(this.params);
    }
    if (this.activatedRoute['_routerState'].snapshot.url == '/orders') {
      this.params.perPage = 12;
      this.pageloadMore.emit(this.params);
    }
  }
}
