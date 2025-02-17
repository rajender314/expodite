import { language } from "./../../../language/language.module";
import { DeleteInventoryComponent } from "./../../../dialogs/delete-inventory/delete-inventory.component";
import { Param } from "./../../../custom-format/param";
import { SnakbarService } from "./../../../services/snakbar.service";
import { Images } from "./../../../images/images.module";
import { InventoryService } from "./../../../services/inventory.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Inject,
  NgZone,
} from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDatepicker } from "@angular/material/datepicker";
import { Title } from "@angular/platform-browser";
import { MatCardModule } from "@angular/material/card";
import { MatTableDataSource } from "@angular/material/table";
import { ViewEncapsulation } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { CookieService } from "ngx-cookie-service";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { DOCUMENT } from "@angular/common";
import * as _ from "lodash";
import * as moment from "moment";
import { AdminService } from "../../../services/admin.service";
import { LeadsService } from "../../../leads/leads.service";
import { UtilsService } from "../../../services/utils.service";
import { OrdersService } from "../../../services/orders.service";
declare var $: any;
declare var App: any;

@Component({
  selector: "app-inventory-info",
  templateUrl: "./inventory-info.component.html",
  styleUrls: ["./inventory-info.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [InventoryService, Title, SnakbarService, CookieService],
  animations: [
    trigger("inventoryAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class InventoryInfoComponent implements OnInit {
  @ViewChild("stepper") stepper: MatStepper;
  @ViewChild("removeFocus") private removeFocus: ElementRef;

  //@ViewChild("manufactureDate", {static: false}) inputEl: ElementRef;
  private language = language;
  public images = Images;
  private batchList = new MatTableDataSource();
  public categoryList: Array<any> = [];
  private statusList: Array<any> = [];
  private InvproductsArr: Array<any> = [];
  private batchStatusArr: Array<any> = [];
  private addInventoryPermission: boolean;
  private mergePermission: boolean;
  orderPermission: boolean;
  public coaSpinner: boolean;
  public open: boolean;
  public selectedClientDetail: Array<any> = [];
  public selectedBatchList = [];
  public selectedBatch = {};
  private timeout;
  private id = 0;
  private showFilter = false;
  public selectedOrdersListBatch = [];
  public minMonth = "MinMonth";
  public maxMonth = "MaxMonth";
  public arr = [];
  public showSavePanel = false;

  private param: Param = {
    page: 1,
    perPage: 25,
    sort: "ASC",
    search: "",
  };
  params = {
    pageSize: 25,
    page: 1,
    search: "",
  };
  private pageSize = 0;

  public reports = {
    batchReportDt: {},
    batchesCoaDt: [],
    batch_id: "",
  };

  public maxDate1 = {
    expiry_date: null,
  };
  public minDate1 = {
    start_date: new Date(),
    expiry_date: null,
  };

  allCoaDetails: any = [];

  editForm: FormGroup;
  public reportsFooter: boolean = false;
  fetchingData: boolean;
  fetchingFiltersData: boolean = true;
  searching: boolean;
  fromDate: any = "";
  toDate: any = "";
  abc: boolean;
  editFormData: object;
  editable: boolean;
  table: boolean;
  noBatches: boolean;
  totalCount: number = 0;
  public submitForm: boolean = false;
  public remainingQtyMsg: boolean;
  particalSize: boolean;
  addParticalIndex: any;
  public invId;
  public BatchName;
  public filterProdList = [];
  public prodName = "";
  public productList = [];
  public restrictProd = false;
  form_id: any;
  detail: any;
  public EditIcon: string =
    App.public_url + "signatures/assets/images/edit_1.png";
  constructor(
    @Inject(DOCUMENT) private document: any,
    private titleService: Title,
    private InventoryService: InventoryService,
    private location: Location,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private leadService: LeadsService,
    private utilsService: UtilsService,
    private OrdersService: OrdersService,
    public adminService: AdminService,
    zone: NgZone
  ) {
    this.activatedRoute.params.subscribe((param) => (this.invId = param.id));
  }
  displayedColumns = ["name", "mfd_date", "exp_date", "tot_qty", "status_name"];

  private timestamp: any;
  public showAddButton = false;

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    // console.log(this.InventoryService.selectedBatch)

    // this.getDetail();
    // this.getReportsData();
    // this.getOrderDetails();
    this.getOrgStoreAttribute();
    // this.getBatchList(true);
    this.getOrgStoreAttributevalue("add_inventory");
    this.showFilter = false;
    this.createForm();
  }
  createForm(): void {
    this.editForm = this.fb.group({
      product_name: "",
      category_id: [null, Validators.required],
      product_types_id: [null, Validators.required],
      batch_nbr: [null, Validators.required],
      tot_qty: [null, [Validators.required, Validators.min(1)]],
      remain_quan: [null, [Validators.required, Validators.min(1)]],
      mfd_date: [null],
      exp_date: [null],
      special_instructions: "",
      status_name: [null],
      batch_status_id: [null],
      id: this.invId,
    });
  }

  goBack(stepper: MatStepper, indx?: number) {
    // if (indx >= 0) stepper.selectedIndex = indx;
    // else stepper.previous();
    // this.editable = false;

    this.router.navigate(["/inventory"]);
  }

  selectCategory(event) {
    this.showSavePanel = true;
    this.filterProdList = [];
    this.arr = [];
    // console.log(event)
    this.productList.forEach((obj) => {
      if (obj.category_id == event.value) {
        this.filterProdList.push(obj);
      }
    });
  }
  valChanged() {
    this.showSavePanel = true;
  }
  selectStatus() {
    this.showSavePanel = true;
  }
  getDetail(data?: any): void {
    this.InventoryService.BatchesList({ id: this.invId })
      .then((response) => {
        if (response.result.success) {
          // this.selectedBatchList = response.result.data.batchesDt;
          // this.BatchName = this.selectedBatchList[0].batch_nbr;

          this.productList = response.result.data.productsDt;
          // let prodId = this.selectedBatchList[0].product_types_id;
          // let catId = this.selectedBatchList[0].category_id;

          // this.filterProdList = this.productList.filter(obj => {
          // 	return obj.category_id == catId
          //   })

          // const index = _.findIndex(this.productList, { id:prodId });
          // // console.log(index)

          // if(index > -1) {
          // 	this.prodName = this.productList[index].name
          // }
          // console.log(this.prodName)

          // this.productList.map(obj => {
          // 	if(obj.id == prodId) {
          // 		// console.log(obj.name)
          // 		this.prodName = obj.name
          // 	}
          // })
          // console.log(this.selectedBatchList)
        }
      })
      .catch((error) => console.log(error));
    this.getBatchClientDetail();
  }
  batchDelete(stepper: MatStepper): void {
    let inventoryDetails = this.getInvDetails();
    let dialogRef = this.dialog.open(DeleteInventoryComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      // height: '240px',
      data: inventoryDetails,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.removeFocus["_elementRef"].nativeElement.classList.remove(
        "cdk-program-focused"
      );
      if (result.success) {
        let toast: object;
        toast = { msg: "Batch deleted successfully.", status: "success" };
        // this.router.navigate(['inventory/list']);
        // this.batchList.data = [];
        this.snackbar.showSnackBar(toast);
        this.router.navigate(["/inventory"]);

        this.getBatchList(true);

        stepper.previous();

        return true;
      }
    });
  }
  getBatchList(clear: any): void {
    if (clear) {
      this.fetchingData = true;
    }
    this.InventoryService.BatchesList(this.params)
      .then((response) => {
        this.fetchingData = false;
        this.fetchingFiltersData = false;
        if (response.result.success) {
          this.totalCount = response.result.data.count;
          this.pageSize = response.result.data.lastpage;
          if (clear) {
            this.batchList.data = [];
          }
          let pre = this.batchList.data;
          let next = response.result.data.batchesDt;
          this.batchList.data = pre.concat(next);
          this.categoryList = response.result.data.categoryDt;
          this.statusList = response.result.data.BatchStausDt;
        }
        this.fetchingData = false;
        this.fetchingFiltersData = false;
      })
      .catch((error) => console.log(error));
  }

  getInvDetails(): Object {
    let details = {
      name: "",
      product_name: "",
      batch_nbr: "",
      products_types_id: "",
      category_id: "",
      tot_qty: "",
      remain_quan: "",
      status_name: "",
      mfd_date: "",
      exp_date: "",
      special_instructions: "",
      id: this.invId,
    };
    if (this.selectedBatchList && this.selectedBatchList.length)
      Object.assign(details, this.selectedBatchList[0]);

    return details;
  }
  public prefillExpData;
  selectManufacringDate(event) {
    // console.log(event.value)
    // this.showExpDatePicker = true;
    this.showSavePanel = true;
    this.minDate1.expiry_date = event.value;
    this.prefillExpData = moment(event.value).add(1, "years")["_d"];
  }
  selectExpiryDate(event) {
    this.showSavePanel = true;
  }
  getBatchClientDetail(data?: any): void {
    this.InventoryService.getBatchClientDetails({ batch_id: this.invId })
      .then((response) => {
        if (response.result.success) {
          this.selectedClientDetail = response.result.data;
        }
      })
      .catch((error) => console.log(error));
  }
  changeBatchReport(data: any, type: any, event: any): void {
    data[type] = event.target.innerText;
    this.reportsFooter = true;
  }
  getReportsData(data?: any): void {
    this.InventoryService.getBatchCoa({ batch_id: this.invId }).then(
      (response) => {
        if (response.result.success) {
          this.reports.batchReportDt = response.result.data.batchReportDt;
          this.reports.batchesCoaDt = response.result.data.batchesCoaDt;
          this.reports.batch_id = response.result.data.batch_id;
        }
      }
    );
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  public showProdErrorMsg = false;
  // update(form: any) {
  //   let toast: object;
  //   let inventoryDetails = this.getInvDetails();
  //   let i = Object.assign(inventoryDetails);
  //   let data = Object.assign(this.editForm.value);
  //   // data.product_types_id = this.arr;
  //   // this.editForm.value['product_types_id'] = this.arr;
  //   // if(i.tot_qty < data.remain_quan) {
  //   // 	this.remainingQtyMsg = true;
  //   // 	return false;
  //   // }
  //   // console.log(form)
  //   if (!this.arr.length) {
  //     // this.arr.push(form.value.product_types_id)
  //     this.showProdErrorMsg = true;
  //   }
  //   // console.log(form.value.product_types_id)
  //   form.value.product_types_id = this.arr;
  //   // if(!form.value.product_types_id.length) {
  //   // 	this.showProdErrorMsg = true;
  //   // 	return;
  //   // } else {
  //   // 	this.showProdErrorMsg = false;
  //   // }
  //   // console.log(form)
  //   // return
  //   if (
  //     form.value.batch_nbr.trim() == "" ||
  //     form.value.batch_nbr.trim() == null ||
  //     form.value.remain_quan == null ||
  //     form.value.remain_quan == 0 ||
  //     form.value.tot_qty == null ||
  //     !form.value.product_types_id.length
  //   ) {
  //     return;
  //   }
  //   this.InventoryService.addBatch(this.editForm.value).then((response) => {
  //     if (response.result.success) {
  //       toast = {
  //         msg: "Batch Details updated successfully.",
  //         status: "success",
  //       };
  //       this.batchList.data.push(data);
  //       this.selectedBatch = data;
  //       this.snackbar.showSnackBar(toast);
  //       this.editable = false;
  //       this.getDetail();
  //       this.getBatchList(true);
  //     } else {
  //       toast = {
  //         msg: response.result.message,
  //         status: "error",
  //         success: "false",
  //       };
  //       this.snackbar.showSnackBar(toast);
  //     }
  //   });
  // }
  update(form: any) {
    let toast: object;
    if (!form.valid) return;
    //  this.showSpinner = true;
    //  this.disabledSave = true;
    let param = {
      form_data: form.value.storeCustomAttributes[0],
      organization_id: "",
      id: this.invId,
      moduleName: this.moduleName
    };
    // let param = Object.assign({}, this.editForm.value.storeCustomAttributes[0]);

    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        toast = { msg: "Inventory Updated Successfully.", status: "success" };
        // setTimeout(() => {
        this.editable = false;
        // this.showSpinner = false;
        // this.disabledSave = false;
        // }, 1000);
        this.snackbar.showSnackBar(toast);
        this.getOrgStoreAttribute();
      } else {
        toast = {
          msg: res.message ? res.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
        // this.showSpinner = false;
        // this.disabledSave = false;
      }
    });
  }
  getOrderDetails(data?: any): void {
    this.InventoryService.OrdersListBatch({ batches_id: this.invId }).then(
      (response) => {
        if (response.result.success) {
          this.selectedOrdersListBatch = response.result.data.batchesDt;
        }
      }
    );
  }

  selectType(event) {
    // console.log(event)
    // this.showProdDrpdown = true;
    this.arr = [];
    // const index = _.findIndex(this.productsList, { category_id: event.value });

    this.filterProdList = this.productList.filter((obj) => {
      return obj.category_id == event.value;
    });

    // this.selectedProduct = this.productsList[index].category_id;
    //   console.log(this.filterProdList)
  }

  selectProduct(event) {
    // console.log(event)
    this.arr = [];
    this.showSavePanel = true;
    this.arr.push(event.value);
    // console.log(this.arr)
    if (this.arr.length) {
      this.showProdErrorMsg = false;
    } else {
      this.showProdErrorMsg = true;
    }

    // console.log( this.removeDuplicates(this.arr))
  }
  resetInventory(form: any) {
    this.editInventory();
    this.editable = false;
  }

  editInventory(): void {
    if (!this.editable) this.editable = true;
    // let inventoryDetails = this.getInvDetails();
    // this.editFormData = inventoryDetails;
    // this.InventoryService.BatchesList({ id: this.invId })
    //   .then((response) => {
    //     if (response.result.success) {
    //       this.categoryList = response.result.data.categoryDt;
    //       this.filterProdList = response.result.data.categoryProductArr;
    //       this.statusList = response.result.data.BatchStausDt;

    //       let catId = this.selectedBatchList[0].category_id;
    //       let prodId = this.selectedBatchList[0].product_types_id;

    //       // this.filterProdList = this.productList.filter(obj => {
    //       // 	return obj.category_id == catId
    //       //   })

    //       // this.filterProdList = this.productList.filter(obj => {
    //       // 	return obj.category_id == catId
    //       //   })

    //       //   this.editForm.patchValue({

    //       // 	product_types_id:  prodId

    //       // })

    //       // console.log(this.filterProdList)

    //       if (this.statusList && this.statusList.length) {
    //         this.statusList = this.statusList.filter((obj) => {
    //           return obj.name != "Exhausted";
    //         });
    //       }
    //     }
    //   })
    //   .catch((error) => console.log(error));

    setTimeout(() => {
      // this.setForm(inventoryDetails);
    }, 500);
  }
  // setForm(data: any): void {
  //   // console.log(data)
  //   if (data.product_types_id != undefined) {
  //     this.restrictProd = false;
  //   } else {
  //     this.restrictProd = true;
  //   }
  //   this.editForm.patchValue({
  //     product_name: data.product_name,
  //     batch_nbr: data.batch_nbr,
  //     product_types_id: data.product_types_id,
  //     category_id: data.category_id,
  //     tot_qty: data.tot_qty,
  //     remain_quan: data.remain_quan,
  //     mfd_date: this.parseDateStringToDate(data.mfd_date),
  //     special_instructions: data.special_instructions,
  //     status_name: data.status_name,
  //     exp_date: this.parseDateStringToDate(data.exp_date),
  //     batch_status_id: data.batch_status_id,
  //     id: this.invId,
  //   });

  //   this.minDate1.expiry_date = this.parseDateStringToDate(data.mfd_date, true);
  //   this.prefillExpData = this.parseDateStringToDate(data.exp_date);
  //   console.log(new Date(data.exp_date), new Date(data.mfd_date), data, 1593);
  //   if (data.product_types_id) {
  //     this.arr.push(data.product_types_id);
  //   }
  //   // this.prefillExpData =  new Date(data.exp_date)
  //   const index = _.findIndex(this.filterProdList, {
  //     id: data.product_types_id,
  //   });
  //   // console.log(index)
  //   if (index == -1) {
  //     this.filterProdList.push({
  //       id: data.product_types_id,
  //       name: data.product_name,
  //     });
  //   }
  //   // console.log(this.filterProdList)

  //   // if(this.productType != undefined) {
  //   // const index = _.findIndex(this.categoryDt, { id: this.productType['category_id'] });
  //   // if(index == -1 && this.productType.category_id != '') {
  //   //   this.categoryDt.push({id: this.productType.category_id, name: this.productType.category_name, status: ''})

  //   // }
  //   //   }
  // }

  parseDateStringToDate(dateString, limit?: boolean) {
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Month in JavaScript starts from 0
    var year = parseInt(parts[2], 10);

    var date = new Date(year, month, day);

    if (limit) {
      date.setDate(date.getDate() + 1);
    }

    return date;
  }
  public moduleName = ""
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.editForm = ev.form;
    this.showSavePanel = true;
  }

  async getOrgStoreAttribute() {
    await this.OrdersService.getViewDetails({
      id: this.invId,
      type: "inventory_details",
    })
      .then(async (response) => {
        if (response.result.success) {
          this.selectedBatchList = response.result.data.add_inventory;
          // this.detail = this.selectedBatchList;
          this.BatchName = this.BatchName =
            this.selectedBatchList[0].batch_number;
        }
      })
      .catch((error) => console.log(error));
  }
  async getOrgStoreAttributevalue(module) {
    await this.leadService
      .getOrgStoreAttributeList({
        module: module,
      })
      .then(async (response) => {
        if (response.result.success) {
          if (module == "add_inventory") {
            this.form_id = response.result.data.attributes.form_id;
            // this.getOrgStoreAttribute();
          }
        }
      })
      .catch((error) => console.log(error));
  }
  public currentTabIndex = 0;
  onTabChange(index: number) {
    this.currentTabIndex = index;
  }
}
