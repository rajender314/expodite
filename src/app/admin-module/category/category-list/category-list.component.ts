import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core';
import { language } from '../../../language/language.module';

import * as _ from 'lodash';
import { Images } from '../../../images/images.module';
import { Param } from '../../../custom-format/param';
import { AdminService } from '../../../services/admin.service';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnakbarService } from '../../../services/snakbar.service';
import { ImportComponent } from '../../../dialogs/import/import.component';
import { LeadsService } from '../../../leads/leads.service';
import { UtilsService } from '../../../services/utils.service';
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
  public images = Images;
  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noCategory: boolean;
  totalPages: number = 0;
  private categoryType: Array<any> = [];
  selectedCategory: object;
  categoryId: any;
  public modulesList = [];
  private listActive = true;
  @Input() update;
  @Output() trigger = new EventEmitter<object>();
  @Input() isAddPerm;
  private param: any = {
    page: 1,
    perPage: 12,
    sort: 'ASC',
    search: ''
  }
  constructor(private adminService: AdminService,
    public dialog: MatDialog,
    private router: Router,
    private snackbar: SnakbarService,
    private leadService: LeadsService,
    private utilsService: UtilsService
    ) { 
    
  }

  backToList() {
    this.listActive = false;
  }

  ngOnInit() {
  //  this.getFormModules()
  this.utilsService.getModuleList().then((response) => {
    this.modulesList = response.result.data.modulesDt;
    const indx = _.findIndex(this.modulesList, {slug: "add_categories"})
    if(indx > -1) {
      this.param.form_id = this.modulesList[indx].id
      this.getCategorys(this.param);
    }
  })
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log(changes)
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
    this.leadService
      .getModuleSavedList(param)
      .then(response => {
        this.paginationScroll = false;
        this.fetchingData = false;
        this.searching = false;
        if (response.result.success) {
          this.totalCount = response.result.data.total;
          this.categoryType = response.result.data.list;
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
  importCatergory(){
    let toast: object;
			let dialogRef = this.dialog.open(ImportComponent, {
				width: '550px',
				data: 'category'
			});
      dialogRef.afterClosed().subscribe(result => {
				if (result.success==true) {
					const config = this.router.config.map((route) => Object.assign({}, route));
				this.router.resetConfig(config);
        this.getCategorys(this.param,'pagination')
			}})
  }


}
