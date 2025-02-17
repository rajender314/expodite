import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChange,
  Injectable,
} from "@angular/core";
import { language } from "../../../language/language.module";

import * as _ from "lodash";

import { Param } from "../../../custom-format/param";
import { AdminService } from "../../../services/admin.service";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { Images } from "../../../images/images.module";
import { LeadsService } from "../../../leads/leads.service";
import { UtilsService } from "../../../services/utils.service";
import { MatDialog } from "@angular/material/dialog";
import { ImportComponent } from "../../../dialogs/import/import.component";
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-view-list",
  templateUrl: "./view-list.component.html",
  styleUrls: ["./view-list.component.scss"],
  animations: [
    trigger("AdminListAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class ViewListComponent implements OnInit, OnChanges {
  public images = Images;
  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noContacts: boolean;
  totalPages: number = 0;
  totalCount: number = 0;
  contactAddressList: Array<any> = [];
  selectedContact: object;
  public language = language;
  public open = false;
  contactsId: any;
  private listActive = true;
  @Input() update;
  @Input() form_module_name;
  @Input() namingConvention;

  @Output() trigger = new EventEmitter<object>();
  @Output() getFormName = new EventEmitter<object>();
  @Input() isAddPerm;
  @Input() isImportPerm;
  public form_name: string;
  private param: any = {
    page: 1,
    perPage: 12,
    sort: "ASC",
    search: "",
  };

  constructor(
    private adminService: AdminService,
    private leadService: LeadsService,
    private utilsService: UtilsService,
    public dialog: MatDialog,

  ) {}

  backToList() {
    this.listActive = false;
  }
  public modulesList = [];

  ngOnInit() {
    // this.getContacts(this.param);
    this.utilsService.getModuleList().then((response) => {
      this.modulesList = response.result.data.modulesDt;
      const indx = _.findIndex(this.modulesList, {
        slug: this.form_module_name,
      });
      if (indx > -1) {
        this.param.form_id = this.modulesList[indx].id;
        this.form_name = this.modulesList[indx].name;
        this.getFormName.emit(this.modulesList[indx]);
        this.getContacts(this.param);
      }
    });
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {
      if (this.update.delete) {
        this.contactAddressList = this.contactAddressList.filter(
          (contactList) => {
            if (contactList.id === this.update.id) {
              return false;
            }
            return true;
          }
        );
        if (this.contactAddressList.length) {
          this.noContacts = false;
          this.selectedContact = this.contactAddressList[0];
        } else {
          this.noContacts = true;
          this.selectedContact = {};
        }
      } else if (this.update.id) {
        this.noContacts = false;
        let types = [];
        this.noContacts = false;
        this.contactAddressList.map((contactList) => {
          if (contactList.id === this.update.id) {
            types.push(this.update.result);
          } else {
            types.push(contactList);
          }
        });
        this.contactAddressList = types;
        this.selectedContact = _.find(this.contactAddressList, {
          id: this.update.id,
        });
      } else {
        this.noContacts = false;
        this.totalCount = this.totalCount + 1;
        this.contactAddressList.unshift(this.update.result);
        this.selectedContact = this.update.result;
      }
      this.trigger.emit(this.selectedContact);
    }
    this.getContacts(this.param, "pagination");
  }

  getContacts(param: object, flag?: string, cb?): void {
    if (flag == "pagination") this.paginationScroll = true;
    else this.fetchingData = true;
    this.leadService
      .getModuleSavedList(param)
      .then((response) => {
        this.paginationScroll = false;
        this.fetchingData = false;
        if (cb) this.searching = false;
        if (response.result.success) {
          this.totalCount = response.result.data.total;
          this.totalPages = Math.ceil(
            Number(this.totalCount) / this.param.perPage
          );
          this.contactAddressList = response.result.data.list;
          if (this.totalCount == 0) this.noRecords();
          else this.getContact(this.contactAddressList[0]);
        } else this.noRecords();
      })
      .catch((error) => console.log(error));
  }

  noRecords(): void {
    this.totalPages = 0;
    this.noContacts = true;
    this.contactAddressList = [];
    this.selectedContact = {};
    this.trigger.emit({ flag: "new" });
  }

  getContact(data?: any): void {
    this.noContacts = false;
    this.selectedContact = data || {};

    this.trigger.emit(this.selectedContact);
  }

  private timeout;
  searchContacts(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getContacts(this.param, "search", () => {});
    }, 1000);
  }

  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getContacts(this.param, "pagination");
    }
  }

  loadMore(param) {
    param.search = this.param.search;
    param.form_id = this.param.form_id;
    this.getContacts(param, "pagination");
  }
  importProduct() {
    let dialogRef = this.dialog.open(ImportComponent, {
      width: "550px",
      data: "products",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success == true) {
      this.getContacts(this.param, "pagination");
      }
    });
  }
}
