import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core';
import { language } from '../../../language/language.module';

import * as _ from 'lodash';

import { Param } from '../../../custom-format/param';
import { AdminService } from '../../../services/admin.service';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Images } from '../../../images/images.module';

@Component({
  selector: 'app-containers-list',
  templateUrl: './containers-list.component.html',
  styleUrls: ['./containers-list.component.scss'],
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
export class ContainersListComponent implements OnInit {
  public images = Images;
  public language = language;
  public open = false;
  totalCount: number = 0;

  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noContainers: boolean;
  totalPages: number = 0;
  private containerTypes: Array<any> = [];
  selectedContainer: object;
  containerId: any;

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
    this.getContainers(this.param);

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {

      if (this.update.delete) {
        this.containerTypes = this.containerTypes.filter(container => {
          if (container.id === this.update.id) {
            return false;
          }
          return true;
        });

        if (this.containerTypes.length) {
          this.noContainers = false;
          this.selectedContainer = this.containerTypes[0];
        } else {
          this.noContainers = true;
          this.selectedContainer = {};
        }

      } else if (this.update.id) {
        this.noContainers = false;
        let types = [];
        this.containerTypes.map(container => {
          if (container.id === this.update.id) {
            types.push(this.update.result);
          } else {
            types.push(container);
          }
        });
        this.containerTypes = types;
        this.selectedContainer = _.find(this.containerTypes, { id: this.update.id })
      } else {
        this.noContainers = false;
        this.totalCount = this.totalCount + 1;
        this.containerTypes.unshift(this.update.result);
        this.selectedContainer = this.update.result;
      }
      this.trigger.emit(this.selectedContainer);
    }
    // this.getContainers(this.param, 'pagination');

  }
  getContainers(param: object, flag?: string, cb?): void {
    if (flag == 'pagination') this.paginationScroll = true;
    else this.fetchingData = true;
    this.adminService
      .getContainersList(param)
      .then(response => {
        this.paginationScroll = false;
        this.fetchingData = false;
        this.searching = false;
        if (response.result.success) {

          this.totalCount = response.result.data.count;
          // console.log(this.totalCount)
          this.containerTypes = response.result.data.ContainersDt;
          if (this.containerTypes.length) {
            this.noContainers = false;
            this.containerTypes[0]['uomData'] = response.result.data.uom_dt;
            this.containerTypes[0]['package_dt'] = response.result.data.package_dt;
          } else {
            this.noContainers = true;
          }

          // console.log(this.adminService.uomData)

          this.totalPages = Math.ceil(Number(this.totalCount) / this.param.perPage);
          if (this.totalCount == 0) {
            this.noRecords();
          } else {

            this.getContainer(this.containerTypes[0])
          }
          // console.log(this.containerTypes)

        }
        else this.noRecords();
      })
      .catch(error => console.log(error))
  }

  noRecords(): void {
    this.totalPages = 0;
    this.noContainers = true;
    this.containerTypes = [];
    this.selectedContainer = {};
    this.trigger.emit({ flag: 'new' });
  }

  getContainer(data?: any): void {
    // console.log(this.containerTypes[0]['uomData'], data)
    this.noContainers = false;
    this.selectedContainer = data || {};
    // if(data && data.uomData == undefined || data && data.package_dt == undefined) {
    // this.selectedContainer['uomData'] =  this.containerTypes[0]['uomData']
    // this.selectedContainer['package_dt'] =  this.containerTypes[0]['package_dt']
    // }
    // this.getContainers(this.param, 'pagination');
    this.trigger.emit(this.selectedContainer);
  }

  private timeout;
  searchContainers(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getContainers(this.param, 'search', () => { });
    }, 1000)
  }
  // onScroll(): void {
  //   if (this.param.page < this.totalPages && this.totalPages != 0) {
  //     this.param.page++;
  //     this.getContainers(this.param, 'pagination');
  //   }
  // }

  loadMore(param) {
    // console.log(param);
    param.search = this.param.search;
    this.getContainers(param, 'pagination');
  }


}
