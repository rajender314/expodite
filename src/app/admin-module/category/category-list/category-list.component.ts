import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core';
import { language } from '../../../language/language.module';

import * as _ from 'lodash';

import { Param } from '../../../custom-format/param';
import { AdminService } from '../../../services/admin.service';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  providers: [AdminService],
  animations: [
    trigger('AdminListAnimate', [
      transition(':enter', [
        style({ transform: 'translateX(-100px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
      ])
    ])
  ]
})
export class CategoryListComponent implements OnInit {
  public language = language;
  public open = false;
  totalCount: number = 0;

  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noCategory: boolean;
  totalPages: number = 0;
  private categoryType: Array<any> = [];
  selectedCategory: object;
  categoryId: any;

  private listActive = true;
  @Input() update;
  @Output() trigger = new EventEmitter<object>();

  private param: Param = {
    page: 1,
    perPage: 12,
    sort: 'ASC',
    search: ''
  }
  constructor(private adminService: AdminService) { }

  backToList() {
    this.listActive = false;
  }

  ngOnInit() {
    this.getCategorys(this.param);
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {

      if (this.update.delete) {
        this.categoryType = this.categoryType.filter(container => {
          if (container.id === this.update.id) {
            return false;
          }
          return true;
        });

        if (this.categoryType.length) {
          this.noCategory = false;
          this.selectedCategory = this.categoryType[0];
        } else {
          this.noCategory = true;
          this.selectedCategory = {};
        }

      } else if (this.update.id) {
        this.noCategory = false;
        let types = [];
        this.categoryType.map(category => {
          if (category.id === this.update.id) {
            types.push(this.update.result);
          } else {
            types.push(category);
          }
        });
        this.categoryType = types;
        this.selectedCategory = _.find(this.categoryType, { id: this.update.id })
      } else {
        this.noCategory = false;
        this.totalCount = this.totalCount + 1;
        this.categoryType.unshift(this.update.result);
        this.selectedCategory = this.update.result;
      }
      this.trigger.emit(this.selectedCategory);
    }
    // this.getCategorys(this.param, 'pagination');

  }
  getCategorys(param: object, flag?: string, cb?): void {
    if (flag == 'pagination') this.paginationScroll = true;
    else this.fetchingData = true;
    this.adminService
      .getCategoryList(param)
      .then(response => {
        this.paginationScroll = false;
        this.fetchingData = false;
        this.searching = false;
        if (response.result.success) {
          this.totalCount = response.result.data.count;
          this.categoryType = response.result.data.categoriesDt;
          this.totalPages = Math.ceil(Number(this.totalCount) / this.param.perPage);
          if (this.totalCount == 0) this.noRecords();
          else this.getCategory(this.categoryType[0])
          // console.log(this.containerTypes)

        }
        else this.noRecords();
      })
      .catch(error => console.log(error))
  }

  noRecords(): void {
    this.totalPages = 0;
    this.noCategory = true;
    this.categoryType = [];
    this.selectedCategory = {};
    this.trigger.emit({ flag: 'new' });
  }

  getCategory(data?: any): void {
    this.noCategory = false;
    this.selectedCategory = data || {};
    this.trigger.emit(this.selectedCategory);
  }

  private timeout;
  searchCategory(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getCategorys(this.param, 'search', () => { });
    }, 1000)
  }
  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getCategorys(this.param, 'pagination');
    }
  }

  loadMore(param) {
    param.search = this.param.search;
    this.getCategorys(param, 'pagination');
  }

}
