import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core';
import { language } from '../../../language/language.module';

import * as _ from 'lodash';

import { Param } from '../../../custom-format/param';
import { AdminService } from '../../../services/admin.service';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { LeadsService } from '../../../leads/leads.service';
import { UtilsService } from '../../../services/utils.service';
import { Images } from '../../../images/images.module';
@Component({
  selector: 'app-incoterm-list',
  templateUrl: './incoterm-list.component.html',
  styleUrls: ['./incoterm-list.component.scss'],
  animations: [
    trigger('AdminListAnimate', [
      transition(':enter', [
        style({ transform: 'translateX(-100px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
      ])
    ])
  ]
})


export class IncotermListComponent implements OnInit {
  public images = Images;
  public language = language;
  public open = false;
  totalCount: number = 0;

  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noShipments: boolean;
  totalPages: number = 0;
  private shipmentType: Array<any> = [];
  selectedShipment: object;
  shipmentId: any;

  private listActive = true;
  @Input() update;
  @Output() trigger = new EventEmitter<object>();
  @Input() isAddPerm;
  private param: any = {
    page: 1,
    perPage: 25,
    sort: 'ASC',
    search: ''
  }
  constructor(private adminService: AdminService, private leadService: LeadsService,
    private utilsService: UtilsService) { }

  backToList() {
    this.listActive = false;
  }
  public modulesList = [];
  ngOnInit() {
    this.utilsService.getModuleList().then((response) => {
      this.modulesList = response.result.data.modulesDt;
      const indx = _.findIndex(this.modulesList, {slug: "add_incoterms"})
      if(indx > -1) {
        this.param.form_id = this.modulesList[indx].id
        this.getShipments(this.param);
      }
    })
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {

      if (this.update.delete) {
        this.shipmentType = this.shipmentType.filter(container => {
          if (container.id === this.update.id) {
            return false;
          }
          return true;
        });

        if (this.shipmentType.length) {
          this.noShipments = false;
          this.selectedShipment = this.shipmentType[0];
        } else {
          this.noShipments = true;
          this.selectedShipment = {};
        }

      } else if (this.update.id) {
        this.noShipments = false;
        let types = [];
        this.shipmentType.map(shipment => {
          if (shipment.id === this.update.id) {
            types.push(this.update.result);
          } else {
            types.push(shipment);
          }
        });
        this.shipmentType = types;
        this.selectedShipment = _.find(this.shipmentType, { id: this.update.id })
      } else {
        this.noShipments = false;
        this.totalCount = this.totalCount + 1;
        this.shipmentType.unshift(this.update.result);
        this.selectedShipment = this.update.result;
      }
      this.trigger.emit(this.selectedShipment);
    }
  }
  getShipments(param: object, flag?: string, cb?): void {
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
          this.shipmentType = response.result.data.list;
          this.totalPages = Math.ceil(Number(this.totalCount) / this.param.perPage);
          if (this.totalCount == 0) this.noRecords();
          else this.getShipment(this.shipmentType[0])
          // console.log(this.containerTypes)

        }
        else this.noRecords();
      })
      .catch(error => console.log(error))
  }

  noRecords(): void {
    this.totalPages = 0;
    this.noShipments = true;
    this.shipmentType = [];
    this.selectedShipment = {};
    this.trigger.emit({ flag: 'new' });
  }

  getShipment(data?: any): void {
    this.noShipments = false;
    this.selectedShipment = data || {};
    this.trigger.emit(this.selectedShipment);
  }

  private timeout;
  searchShipments(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getShipments(this.param, 'search', () => { });
    }, 1000)
  }
  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getShipments(this.param, 'pagination');
    }
  }




}