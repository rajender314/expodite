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
import { ImportComponent } from "../../../dialogs/import/import.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SnakbarService } from "../../../services/snakbar.service";
import { Images } from "../../../images/images.module";
import { LeadsService } from "../../../leads/leads.service";
import { UtilsService } from "../../../services/utils.service";
@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  animations: [
    trigger("AdminListAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class ProductListComponent implements OnInit {
  public images = Images;
  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noProducts: boolean;
  totalPages: number = 0;
  totalCount: number = 0;
  productLIst: Array<any> = [];
  categoryData: Array<any> = [];
  priceData: Array<any> = [];

  selectedProduct: object;
  public language = language;
  public open = false;
  productId: any;
  private listActive = true;
  @Input() update;
  @Output() trigger = new EventEmitter<object>();
  @Output() getCategory = new EventEmitter<object>();
  @Input() isAddPerm;
  private param: any = {
    page: 1,
    perPage: 12,
    sort: "ASC",
    search: "",
  };
  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private router: Router,
    private snackbar: SnakbarService,
    private leadService: LeadsService,
    private utilsService: UtilsService
  ) {}

  backToList() {
    this.listActive = false;
  }
  public modulesList = [];
  ngOnInit() {
    // this.getProducts(this.param);
    this.utilsService.getModuleList().then((response) => {
      this.modulesList = response.result.data.modulesDt;
      const indx = _.findIndex(this.modulesList, { slug: "add_products" });
      if (indx > -1) {
        this.param.form_id = this.modulesList[indx].id;
        this.getProducts(this.param);
      }
    });
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {
      if (this.update.delete) {
        this.productLIst = this.productLIst.filter((productList) => {
          if (productList.id === this.update.id) {
            return false;
          }
          return true;
        });

        if (this.productLIst.length) {
          this.noProducts = false;
          this.selectedProduct = this.productLIst[0];
        } else {
          this.noProducts = true;
          this.selectedProduct = {};
        }
      } else if (this.update.id) {
        this.noProducts = false;
        let types = [];
        this.productLIst.map((productList) => {
          if (productList.id === this.update.id) {
            types.push(this.update.result);
          } else {
            types.push(productList);
          }
        });
        this.productLIst = types;
        this.selectedProduct = _.find(this.productLIst, { id: this.update.id });
      } else {
        this.noProducts = false;
        this.totalCount = this.totalCount + 1;
        this.productLIst.unshift(this.update.result);
        this.selectedProduct = this.update.result;
      }
      this.trigger.emit(this.selectedProduct);
    }
    this.getProducts(this.param, 'pagination');
  }

  getProducts(param: object, flag?: string, cb?): void {
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
          this.productLIst = response.result.data.list;
          if (this.totalCount == 0) this.noRecords();
          else this.getProduct(this.productLIst[0]);
        } else this.noRecords();
      })
      .catch((error) => console.log(error));
  }

  noRecords(): void {
    this.totalPages = 0;
    this.noProducts = true;
    this.productLIst = [];
    this.selectedProduct = {};
    this.trigger.emit({ flag: "new" });
  }

  getProduct(data?: any): void {
    this.noProducts = false;
    this.selectedProduct = data || {
      category_id: "",
      description: "",
      id: "",
      name: "",
      price: "",
      priceRange: this.priceData,
    };
    this.trigger.emit(this.selectedProduct);
  }

  private timeout;
  searchProducts(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getProducts(this.param, "search", () => {});
    }, 1000);
  }

  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getProducts(this.param, "pagination");
    }
  }

  loadMore(param) {
    param.search = this.param.search;
    this.getProducts(param, "pagination");
  }
  importProduct() {
    let toast: object;
    let dialogRef = this.dialog.open(ImportComponent, {
      width: "550px",
      data: "products",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success == true) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        this.getProducts(this.param, "search");
      }
    });
  }
}
