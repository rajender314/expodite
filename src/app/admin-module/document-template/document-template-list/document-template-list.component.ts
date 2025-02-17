import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import { language } from "../../../language/language.module";

import * as _ from "lodash";
import { Images } from "../../../images/images.module";
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

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SnakbarService } from "../../../services/snakbar.service";
import { ImportComponent } from "../../../dialogs/import/import.component";
@Component({
  selector: "app-document-template-list",
  templateUrl: "./document-template-list.component.html",
  styleUrls: ["./document-template-list.component.scss"],
  animations: [
    trigger("AdminListAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class DocumentTemplateListComponent implements OnInit {
  public language = language;
  public open = false;
  totalCount: number = 0;
  public images = Images;
  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noDocuTemplate: boolean;
  totalPages: number = 0;
  private documentType: Array<any> = [];
  documentData: object;
  categoryId: any;
  public copyFormArray: Array<any> = [];
  private listActive = true;
  @Input() update;
  @Input() typeOfDocument;

  @Output() trigger = new EventEmitter<object>();
  @Input() isAddPerm = true;
  public DocumentArrayList = new Map();
  public DocumentArray;
  public docMapArray;
  private param: Param = {
    page: 1,
    perPage: 12,
    sort: "ASC",
    search: "",
  };
  constructor(
    public adminService: AdminService,
    public dialog: MatDialog,
    private router: Router,
    private snackbar: SnakbarService
  ) {}

  backToList() {
    this.listActive = false;
  }

  ngOnInit() {
    this.getDocumentTemplates(this.param);
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {
      if (this.update.id) {
        this.noDocuTemplate = false;
        let types = this.documentType.map((template) =>
          template.id === this.update.id ? this.update.result : template
        );
        this.documentType = types;
        this.documentData = _.find(this.documentType, { id: this.update.id });
      } else {
        this.noDocuTemplate = false;
        this.totalCount += 1;
        this.documentType.unshift(this.update.result);
        this.documentData = this.update.result;
      }
      this.updateDocMapArray();
      this.trigger.emit(this.documentData);
    }
  }

  updateDocMapArray() {
    this.DocumentArrayList.clear();
    this.documentType.forEach((item) => {
      let id = item.document_template_types_id
        ? item.document_template_types_id
        : item.type_id;
      if (this.DocumentArrayList.has(id)) {
        this.DocumentArrayList.get(id).push(item);
      } else {
        this.DocumentArrayList.set(id, [item]);
      }
    });
    this.docMapArray = Array.from(this.DocumentArrayList, ([key, value]) => ({
      key: key,
      value: value,
    }));
  }
  getDocumentTemplates(param: object, flag?: string, cb?): void {
    if (flag == "pagination") this.paginationScroll = true;
    else this.fetchingData = true;

    this.adminService
      .getDocumentTemplates(param)
      .then((response) => {
        this.paginationScroll = false;
        this.fetchingData = false;
        this.searching = false;
        if (response.result.success) {
          this.totalCount = response.result.data.count;
          this.documentType = response.result.data.templates;
          // Clear the existing DocumentArrayList
          this.DocumentArrayList.clear();
          // Populate DocumentArrayList with the new data
          this.documentType.forEach((item) => {
            let id = item.document_template_types_id
              ? item.document_template_types_id
              : item.type_id;
            console.log(id, 45);
            if (this.DocumentArrayList.has(id)) {
              this.DocumentArrayList.get(id).push(item);
            } else {
              this.DocumentArrayList.set(id, [item]);
            }
          });
          // Convert DocumentArrayList to an array
          this.docMapArray = Array.from(
            this.DocumentArrayList,
            ([key, value]) => ({ key: key, value: value })
          );

          this.totalPages = Math.ceil(
            Number(this.totalCount) / this.param.perPage
          );

          if (this.totalCount == 0) {
            this.noRecords();
          } else {
            this.getTemplate(this.documentType[0]);
          }
        } else {
          this.noRecords();
          this.paginationScroll = false;
        }
      })
      .catch((error) => {
        this.noDocuTemplate = true;

        this.paginationScroll = false;
        this.fetchingData = false;
        console.log(error);
      });
  }

  noRecords(): void {
    this.totalPages = 0;
    this.noDocuTemplate = true;
    this.documentType = [];
    this.documentData = {};
    this.trigger.emit({ flag: "new" });
  }

  getTemplate(data?: any): void {
    this.noDocuTemplate = false;
    this.documentData = data || {};
    this.trigger.emit(this.documentData);
  }

  private timeout;
  searchTemplate(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getDocumentTemplates(this.param, "search", () => {});
    }, 1000);
  }
  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getDocumentTemplates(this.param, "pagination");
    }
  }

  loadMore(param) {
    param.search = this.param.search;
    this.getDocumentTemplates(param, "pagination");
  }

  getDocTempTypeName(id) {
    return this.typeOfDocument?.find((e) => e.id == id).name;
  }
}
