import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ProductDetailCellComponent } from "../components/product-detail-cell/product-detail-cell.component";
import { AgCustomHeaderComponent } from "../components/ag-custom-header/ag-custom-header/ag-custom-header.component";
import { Images } from "../../images/images.module";
import { IServerSideGetRowsParams, RowNode } from "ag-grid-community";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { AgGridEditComponent } from "../components/ag-grid-edit/ag-grid-edit.component";
import { EditiconCellComponent } from "../components/editicon-cell/editicon-cell.component";
import { CustomLoadingCellRenderer } from "./custom-ag-loader";
import { AgProductEditComponent } from "../components/ag-product-edit/ag-product-edit.component";

import * as _ from "lodash";
import { ConfirmDeleteComponent } from "../components/confirm-delete/confirm-delete.component";
import { language } from "../../language/language.module";
import { ReportsService } from "../../services/reports.service";
import { AdminService } from "../../services/admin.service";

declare var App: any;

@Component({
  selector: "app-ag-grid-view",
  templateUrl: "./ag-grid-view.component.html",
  styleUrls: ["./ag-grid-view.component.scss"],
})
export class AgGridViewComponent implements OnInit {
  @Input() orders: any;
  @Input() isEditable: any;
  @Output() emitGridEvent: any = new EventEmitter();
  @Output() emitRowData: any = new EventEmitter();
  @Output() getContainersData: any = new EventEmitter();
  @Output() paidInvoice: any = new EventEmitter();
  @Output() editContainer: any = new EventEmitter();
  @Input() selectPO: any;
  @Input() selectOrder: any;
  @Input() originFileAttachments: any;
  @Input() tableName: any;
  @Input() isEditColumnDisplay: any = true;
  @Input() enableSplit: any = false;
  @Input() poDetails: any;
  @Input() selectdRows: any;
  @Input() newColumnAdded;
  @Input() paymentsId: any;
  @Input() container_id: any;
  public gridApi;
  public gridColumnApi;
  public language = language;

  private images = Images;
  defaultColDef = {};
  public sidebarPanel = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        minWidth: 225,
        width: 225,
        maxWidth: 225,
      },
    ],
    defaultToolPanel: "",
  };
  rowData = [];
  public noProductImg: string =
    App.public_url + "signatures/assets/images/no_product.png";
  public EditIcon: string =
    App.public_url + "signatures/assets/images/edit_1.png";

  colDefs = [];
  public frameworkComponents: any;
  public estimate_id = "";
  public noRowsTemplate;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public ReportsService: ReportsService,
    public adminService: AdminService
  ) {
    this.noRowsTemplate = `<span>No Data Found</span>`;
    this.activatedRoute.params.subscribe((param) => {
      if (param.shipmentId) {
        this.estimate_id = param.shipmentId;
      } else this.estimate_id = param.id;
    });
    this.frameworkComponents = {
      productCellRenderer: ProductDetailCellComponent,
      customHeaderComponent: AgCustomHeaderComponent,
      editiconCellComponent: EditiconCellComponent,
    };
  }
  public loadingCellRenderer: any = CustomLoadingCellRenderer;
  public loadingCellRendererParams: any = {
    loadingMessage: "One moment please...",
  };
  public endPointUrl = "";
  ngOnInit(): void {
    // console.log(this.poDetails);
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    if (this.tableName == "estimate-table") {
      this.endPointUrl = `getViewDetails?name=pfi_product_details&id=${this.estimate_id}`;
    } else if (this.tableName == "orderDetail") {
      this.endPointUrl = `getViewDetails?name=order_product_details&id=${this.estimate_id}`;
    } else if (this.tableName == "shipmentDetail") {
      this.endPointUrl = `getViewDetails?name=shipment_product_details&id=${this.estimate_id}`;
    } else if (this.tableName == "customInvoice") {
      this.endPointUrl = `getCustomInvProducts?orders_id=${this.estimate_id}`;
    } else if (this.tableName == "taxInvoice") {
      this.endPointUrl = `getTaxInvProducts?orders_id=${this.estimate_id}`;
    } else if (this.tableName == "commercialInvoice") {
      this.endPointUrl = `getViewDetails?name=commercial_invoice_products&id=${this.paymentsId}`;
      // this.endPointUrl = `getCommercialInvProducts?orders_id=${this.estimate_id}`;
    } else if (this.tableName == "customsInvoice") {
      this.endPointUrl = `getViewDetails?name=customs_invoice_products&id=${this.paymentsId}`;
      // this.endPointUrl = `getCommercialInvProducts?orders_id=${this.estimate_id}`;
    } else if (this.tableName == "newCommercialInvoice") {
      // this.endPointUrl = `getInvProducts?invoice_id=${this.estimate_id}`;
      this.endPointUrl = `getViewDetails?name=commercial_invoice_products&id=${this.paymentsId}`;
    } else if (this.tableName == "poInvoice") {
      this.endPointUrl = `getViewDetails?name=po_product_details&id=${this.estimate_id}`;
    } else if (this.tableName == "freight_container_details") {
      this.endPointUrl = `getViewDetails?name=freight_container_details&id=${this.estimate_id}`;
    } else if (this.tableName == "payments") {
      this.endPointUrl = `getViewDetails?name=commercial_invoice_payments&id=${this.paymentsId}`;
    } else if (this.tableName == "shipment_container_details") {
      this.endPointUrl = `getContainers?id=${this.estimate_id}`;
    } else if (this.tableName == "unassigned_packages") {
      this.endPointUrl = `getUnassignedPackages?id=${
        this.paymentsId
      }&container_id=${this.container_id ? this.container_id : ""}`;
    } else if (this.tableName == "shipment_pallet_details") {
      this.endPointUrl = `getViewDetails?name=shipment_pallet_details&id=${this.estimate_id}`;
    } else if (this.tableName == "shipment_package_details") {
      this.endPointUrl = `getViewDetails?name=shipment_package_details&id=${this.estimate_id}`;
    }
  }
  public gridClass = "ag-theme-alpine ag-theme-balham orders-grid";
  ngOnChanges(changes: SimpleChanges) {
    if (this.newColumnAdded || changes.isEditable) {
      this.activatedRoute.params.subscribe((param) => {
        if (param.shipmentId) {
          this.estimate_id = param.shipmentId;
        } else this.estimate_id = param.id;
      });
      if (this.gridApi) this.gridApi.purgeServerSideCache([]);
    }
    if (changes.hasOwnProperty("selectPO")) {
      this.selectPO = changes["selectPO"].currentValue;
    }
    if (changes.hasOwnProperty("selectOrder")) {
      this.selectOrder = changes["selectOrder"].currentValue;
    }
    if (this.selectPO || this.selectOrder) {
      this.gridClass = "ag-theme-alpine ag-theme-balham orders-grid enable-po";
      // this.gridColumnApi.setColumnVisible('edit', false);
      const index = _.findIndex(this.colDefs, { field: "edit" });
      if (index > -1) {
        this.colDefs.splice(index, 1);
      }
      const ele = {
        width: 40,
        field: "select_all",
        headerName: "",
        pinned: "left",
        lockPinned: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        dragable: false,
        suppressMovable: true,
        headerComponent: "customHeaderComponent",
        cellClass: ["align-right", "pr-2", "flex-justify"],
        headerClass: ["checkbox-header-center"],
        checkboxSelection: (params) => this.checkboxSelection(params),
        cellRendererParams: {},
        allowDragFromColumnsToolPanel: false,
      };
      const selectAllColumnExists = this.colDefs.some(
        (colDef: any) => colDef.field === "select_all"
      );
      if (!selectAllColumnExists) {
        this.colDefs.unshift(ele);
      }

      this.colDefs = this.colDefs.map((colDef: any) => {
        if (colDef.cellRendererParams?.customParams) {
          colDef.cellRendererParams.customParams = {
            ...colDef.cellRendererParams?.customParams,
            isCheckBoxColumn: true,
          };
        }
        return colDef;
      });
    } else {
      this.gridClass = "ag-theme-alpine ag-theme-balham orders-grid";
      this.colDefs = this.colDefs.filter(
        (colDef) => colDef.field !== "select_all"
      );
      this.colDefs = this.colDefs.map((colDef: any) => {
        if (colDef.cellRendererParams?.customParams) {
          colDef.cellRendererParams.customParams = {
            ...colDef.cellRendererParams?.customParams,
            isCheckBoxColumn: false,
          };
        }
        return colDef;
      });
      // this.gridColumnApi.setColumnVisible('edit', true);
      const index = _.findIndex(this.colDefs, { field: "edit" });
      if (index < 0) {
        const valueEdit = {
          headerName: "Edit",
          pinned: "right",
          field: "edit",
          width: 40,
          maxWidth: 40,
          cellStyle: { cursor: "pointer" },
          cellClass: ["edit-pencil"],
          headerClass: ["edit-pencil"],
          // cellRenderer: (params: any) =>
          // this.orders.selectedOrder.status_id != 4 && !params.data.is_order_created ? `<img src=${this.EditIcon} className='Icon' style='height: 14px; width: 14px' alt='loading'/>` : ``,
          onCellClicked: this.onCellClicked.bind(this),
          cellRendererParams: {
            customParams: {
              orders: this.orders,
              selectPO: this.selectPO,
              selectOrder: this.selectOrder,
              tableName: this.tableName,
              enableSplit: this.enableSplit,
            },
          },
          cellRenderer: "editiconCellComponent",
        };
        this.colDefs.push(valueEdit);
      }
    }
    if (changes.hasOwnProperty("enableSplit")) {
      this.enableSplit = changes["enableSplit"].currentValue;
      this.colDefs = this.colDefs.map((colDef: any) => {
        colDef.cellRendererParams.customParams = {
          ...colDef.cellRendererParams.customParams,
          enableSplit: this.enableSplit,
        };
        return colDef;
      });
    }

    if (changes.hasOwnProperty("selectdRows")) {
      setTimeout(() => {
        this.gridApi.forEachNode((node: RowNode) => {
          node.setSelected(false);
        });
      }, 100);
    }
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.colDefs);
    }
  }
  public datasource;
  async onGridReady(params) {
    // console.log(params);
    //

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const datasource: any = {
      getRows: async (params: IServerSideGetRowsParams) => {
        this.http
          .get<any>(`${App.base_url}${this.endPointUrl}`)
          .subscribe(async (response) => {
            // if (this.tableName == "estimate-table" || this.tableName == "orderDetail") {
            //   console.log(this.tableName)
            //   this.colDefs =
            //     response.result.data.column_data;
            // } else if (this.tableName == "freight_container_details") {
            //   this.colDefs = response.result.data.column_data;
            // } else {
            if (!response || !response.result || !response.result.data) {
              params.failCallback();
              return;
            }

            // Proceed with processing the valid response
            this.colDefs = response.result.data.column_data || [];
            // }

            await this.modifyColumnData(this.gridColumnApi);

            const valueEdit = {
              headerName: "Edit",
              pinned: "right",
              field: "edit",
              width: 40,
              maxWidth: 40,
              cellStyle: { cursor: "pointer" },
              cellClass: ["edit-pencil"],
              headerClass: ["edit-pencil"],
              lockPinned: true,
              // cellRenderer: (params: any) =>
              // this.orders.selectedOrder.status_id != 4 && !params.data.is_order_created ? `<img src=${this.EditIcon} className='Icon' style='height: 14px; width: 14px' alt='loading'/>` : ``,
              onCellClicked: this.onCellClicked.bind(this),
              cellRendererParams: {
                customParams: {
                  orders: this.orders,
                  selectPO: this.selectPO,
                  selectOrder: this.selectOrder,
                  tableName: this.tableName,
                  enableSplit: this.enableSplit,
                },
              },
              cellRenderer: "editiconCellComponent",
            };
            if (
              this.tableName != "newCommercialInvoice" &&
              this.tableName != "taxInvoice" &&
              this.isEditColumnDisplay
            ) {
              if (this.tableName == "estimate-table" || this.tableName == "payments") {
                if (this.isEditable) {
                  this.colDefs.push(valueEdit);
                }
              } else if (
                this.tableName == "orderDetail" ||
                this.tableName == "shipmentDetail" ||
                this.tableName == "shipment_container_details" ||
                this.tableName == "shipment_pallet_details" ||
                this.tableName == "shipment_package_details"
              ) {
                if (this.isEditable) {
                  this.colDefs.push(valueEdit);
                }
              } else if (this.tableName == "poInvoice") {
                if (
                  this.poDetails?.add_po[0]?.status_slug != "po_cancelled" &&
                  this.poDetails?.add_po[0]?.status_slug != "PO Sent"
                ) {
                  if (this.isEditable) {
                    this.colDefs.push(valueEdit);
                  }
                }
              } else if (
                this.tableName == "commercialInvoice" ||
                this.tableName == "customsInvoice"
              ) {
                if (!this.selectOrder && this.isEditable) {
                  this.colDefs.push(valueEdit);
                }
              } else if (this.tableName == "shipment_container_details") {
              } else if (this.tableName == "payments" && this.adminService.rolePermissions.delete_payment == 1) {
                this.colDefs.push(valueEdit);
                const valueDelete = {
                  headerName: "Delete",
                  pinned: "right",
                  field: "delete",
                  width: 40,
                  maxWidth: 40,
                  cellStyle: { cursor: "pointer" },
                  cellClass: ["edit-pencil"],
                  headerClass: ["edit-pencil"],
                  lockPinned: true,
                  // cellRenderer: (params: any) =>
                  // this.orders.selectedOrder.status_id != 4 && !params.data.is_order_created ? `<img src=${this.EditIcon} className='Icon' style='height: 14px; width: 14px' alt='loading'/>` : ``,
                  onCellClicked: this.onCellClicked.bind(this),

                  cellRenderer: () =>
                    `<div class="cell-Icon-text" ><img src=${this.images.deleteIcon} alt='loading' style="width: 20px; height: 20px" class='radius-none'/></div>`,
                };
                this.colDefs.push(valueDelete);
              } else {
                this.colDefs.push(valueEdit);
              }
            }

            if (this.tableName == "freight_container_details") {
              const valueDelete = {
                headerName: "Delete",
                pinned: "right",
                field: "delete",
                width: 40,
                maxWidth: 40,
                cellStyle: { cursor: "pointer" },
                cellClass: ["edit-pencil"],
                headerClass: ["edit-pencil"],
                lockPinned: true,
                // cellRenderer: (params: any) =>
                // this.orders.selectedOrder.status_id != 4 && !params.data.is_order_created ? `<img src=${this.EditIcon} className='Icon' style='height: 14px; width: 14px' alt='loading'/>` : ``,
                onCellClicked: this.onCellClicked.bind(this),
                cellRendererParams: {
                  customParams: {
                    orders: this.orders,
                    selectPO: this.selectPO,
                    selectOrder: this.selectOrder,
                    tableName: this.tableName,
                    enableSplit: this.enableSplit,
                  },
                },
                cellRenderer: () =>
                  `<div class="cell-Icon-text" ><img src=${this.images.deleteIcon} alt='loading' style="width: 20px; height: 20px" class='radius-none'/></div>`,
              };
              this.colDefs.push(valueDelete);
            }

            setTimeout(async () => {
              if (response.result.success) {
                if (
                  this.tableName == "estimate-table" ||
                  this.tableName == "orderDetail"
                ) {
                  let row_data;
                  try {
                    const pfiProdMappings = await this.http
                      .get<any>(
                        `${App.base_url}${
                          this.tableName == "orderDetail"
                            ? "getOrderShipmentMapping"
                            : "getPFIProdMappings"
                        }?id=${this.estimate_id}`
                      )
                      .toPromise();
                    if (
                      response.result.data.row_data &&
                      response.result.data.row_data.length ===
                        pfiProdMappings.result.data.length
                    ) {
                      row_data = response.result.data.row_data.map((f) => {
                        let matchingprod = pfiProdMappings.result.data.find(
                          (s) => s.product_id === f.id
                        );
                        return {
                          ...matchingprod,
                          ...f,
                        };
                      });
                      params.successCallback(
                        // response.result.data.add_product_in_create.row_data,
                        // response.result.data.add_product_in_create.row_data.length
                        row_data || [],
                        row_data ? row_data.length : 0
                      );
                      this.emitRowData.emit({ row_data: row_data });
                    } else {
                      params.successCallback(
                        response.result.data.row_data || [],
                        response.result.data.row_data
                          ? response.result.data.row_data.length
                          : 0
                      );
                    }
                  } catch (error) {
                    params.successCallback(
                      response.result.data.row_data || [],
                      response.result.data.row_data
                        ? response.result.data.row_data.length
                        : 0
                      //  row_data,
                      //  row_data.length
                    );
                  }
                } else {
                  params.successCallback(
                    response.result.data.row_data || [],
                    response.result.data.row_data
                      ? response.result.data.row_data.length
                      : 0
                  );
                  if (this.tableName == "shipment_container_details") {
                    this.getContainersData.emit(response.result.data.row_data);
                  }
                }
                var allColumnIds: any = [];
                this.gridColumnApi
                  .getAllColumns()
                  .forEach(function (column: any) {
                    // if (column.colId != "amount") {
                    allColumnIds.push(column.colId);
                    // }
                  });
                if (!response.result.data.row_data) {
                  this.gridApi.showNoRowsOverlay();
                } else if (
                  response.result.data.row_data &&
                  response.result.data.row_data.length
                ) {
                  this.gridApi.hideOverlay();
                } else {
                  this.gridApi.hideOverlay();
                }
                // this.gridColumnApi.autoSizeColumns(allColumnIds);

                // setTimeout(() => {
                //   this.gridApi.sizeColumnsToFit();

                // }, 1000);

                // this.gridColumnApi.autoSizeColumns(allColumnIds);

                // setTimeout(() => {
                //   if (this.reminingWidth > 0) {
                //     this.gridColumnApi.setColumnWidth(
                //       "product_description",
                //       this.descriptionActualWidth + this.reminingWidth
                //     );
                //   }
                // }, 100);
              } else {
                params.failCallback();
              }
            }, 200);

            setTimeout(() => {
              // if (this.tableName == "estimate-table" || this.tableName == "orderDetail") {
              // this.gridColumnApi.autoSizeColumns(["amount"]);
              // } else {
              //   this.gridColumnApi.autoSizeColumns(['amount']);
              // }
              if (this.tableName == "unassigned_packages") {
                response.result.data.row_data.forEach((row, index) => {
                  if (row.isChecked) {
                    this.gridApi
                      .getDisplayedRowAtIndex(index)
                      ?.setSelected(true);
                  }
                });
              }
            }, 1000);
          });
      },
    };

    params.api.setServerSideDatasource(datasource);

    setTimeout(() => {
      const allColumnIds = params.columnApi.getAllColumns().map((col) => {
        return col.getColId();
      });
      params.columnApi.autoSizeColumns(allColumnIds);
      params.api.sizeColumnsToFit();
    }, 1500);
  }
  checkboxSelection(params: any) {
    // console.log(params)
    // Disable checkbox if product_quantity is 0
    // return this.selectPO
    //   ? params.data.is_po_created == false
    //   : params.data.is_order_created == false;

    // return this.selectPO
    //                                       ? !params.data.is_order_created ||
    //                                       !params.data.is_po_created
    //                                       : !params.data.is_order_created

    // console.log(this.selectOrder, this.selectPO)
    if (
      params.data &&
      !params.data.is_po_created &&
      !params.data.is_order_created
    ) {
      return true;
    } else if (
      params.data &&
      params.data.is_po_created &&
      !params.data.is_order_created
    ) {
      return this.selectPO ? false : true;
    } else {
      return false;
    }
  }
  private editDialogOpen(event, module, title, moduleId = "") {
    let dialogRef = this.dialog.open(AgProductEditComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        rowData: event.node.data,
        title: title,
        saveApi: App.base_url + "updatePFIProduct",
        tableName: module,
        related_to_id: this.paymentsId ? this.paymentsId : this.estimate_id,
        type: "product",
        module_id: moduleId,
      },
      disableClose: true,
    });
    return dialogRef;
  }
  onCellClicked(event: any) {
    let dialogRef;
    if (this.tableName == "estimate-table") {
      if (
        this.orders &&
        this.orders.selectedOrder.status_slug != "order_confirmed" &&
        this.orders.selectedOrder.status_slug != "cancelled" &&
        !event.data.is_order_created
      ) {
        dialogRef = this.editDialogOpen(
          event,
          "add_product_in_create",
          `Edit ${language.pageNavbar.product}`,
          this.estimate_id
        );
      }
    } else if (
      this.tableName == "orderDetail" ||
      this.tableName == "commercialInvoice" ||
      this.tableName == "customsInvoice" ||
      this.tableName == "shipmentDetail"
    ) {
      if (this.orders && this.orders.selectedOrder.status_slug != "cancelled") {
        dialogRef = this.editDialogOpen(
          event,
          this.tableName == "commercialInvoice"
            ? "edit_product_in_commercial_inv"
            : this.tableName == "customsInvoice"
            ? "edit_product_in_customs_inv"
            : this.tableName == "shipmentDetail"
            ? "add_product_in_shipment"
            : "add_product_in_order",
          `Edit ${language.pageNavbar.product}`,
          this.estimate_id
        );
      }
    } else if (this.tableName == "shipment_container_details") {
      this.editContainer.emit({ rowData: event.node.data });
    } else if (
      this.tableName == "shipment_pallet_details" ||
      this.tableName == "shipment_package_details"
    ) {
      if (this.orders && this.orders.selectedOrder.status_slug != "cancelled") {
        dialogRef = this.editDialogOpen(
          event,
          this.tableName == "shipment_container_details"
            ? "create_container"
            : this.tableName == "shipment_pallet_details"
            ? "create_pallet"
            : this.tableName == "shipment_package_details"
            ? "create_package"
            : "add_product_in_order",
          this.tableName == "shipment_container_details"
            ? "Edit Container"
            : this.tableName == "shipment_pallet_details"
            ? "Edit Pallet"
            : this.tableName == "shipment_package_details"
            ? "Edit Package"
            : `Edit ${language.pageNavbar.product}`
        );
      }
    } else if (this.tableName == "poInvoice") {
      dialogRef = this.editDialogOpen(
        event,
        "add_products_in_po",
        `Edit ${language.pageNavbar.product}`,
        this.estimate_id
      );
    } else if (
      (this.orders &&
        this.orders.selectedOrder.status_id != 4 &&
        !event.data.is_order_created) ||
      this.tableName == "poInvoice"
    ) {
      dialogRef = this.dialog.open(AgGridEditComponent, {
        panelClass: "alert-dialog",
        width: "550px",
        data: {
          rowData: event.node.data,
          title:
            this.tableName == "estimate-table"
              ? "Edit Proforma Invoice"
              : this.tableName == "orderDetail"
              ? "Edit Order Details"
              : this.tableName == "shipmentDetail"
              ? "Edit Order Details"
              : this.tableName == "customInvoice"
              ? "Edit Custom Invoice"
              : this.tableName == "taxInvoice"
              ? "Edit Tax Invoice"
              : this.tableName == "commercialInvoice"
              ? "Edit Commercial Invoice"
              : this.tableName == "customsInvoice"
              ? "Edit Customs Invoice"
              : this.tableName == "poInvoice"
              ? "Edit PO Invoice"
              : "Edit",
          saveApi:
            this.tableName == "estimate-table"
              ? App.base_url + "updatePFIProduct"
              : this.tableName == "orderDetail"
              ? App.base_url + "updateOrderProduct"
              : this.tableName == "shipmentDetail"
              ? App.base_url + "updateShipmentProduct"
              : this.tableName == "customInvoice"
              ? App.base_url + "updateCustomInvProduct"
              : this.tableName == "poInvoice"
              ? App.base_url + "updatePOProduct"
              : this.tableName == "commercialInvoice"
              ? App.base_url + "updateCommercialInvProduct"
              : this.tableName == "customsInvoice"
              ? App.base_url + "updateCustomsInvProduct"
              : "",
        },
        disableClose: true,
      });
    } else if (this.tableName == "freight_container_details") {
      if (event.colDef.field == "edit") {
        dialogRef = this.editDialogOpen(
          event,
          "add_container",
          "Edit Container"
        );
        // dialogRef = this.dialog.open(AgProductEditComponent, {
        //   panelClass: "alert-dialog",
        //   width: "550px",
        //   data: {
        //     rowData: event.node.data,
        //     title: "Edit Container",
        //     saveApi:
        //       this.tableName == "estimate-table"
        //         ? App.base_url + "updatePFIProduct"
        //         : "",
        //     tableName: "add_container",
        //   },
        //   disableClose: true,
        // });
      } else if (event.colDef.field == "delete") {
        dialogRef = this.dialog.open(ConfirmDeleteComponent, {
          panelClass: "alert-dialog",
          width: "550px",
          data: {
            rowData: event.node.data,
            title: "Delete Container",
            delete_item: "container",
            saveApi:
              this.tableName == "estimate-table"
                ? App.base_url + "updatePFIProduct"
                : "",
            tableName: "add_container",
          },
          disableClose: true,
        });
      }
    } else if (this.tableName == "payments") {
      if (event.colDef.field == "edit") {
        this.paidInvoice.emit(event);

        // dialogRef = this.editDialogOpen(
        //   event,
        //   "commercial_invoice_add_payment",
        //   "Edit Payment"
        // );
      } else if (event.colDef.field == "delete") {
        dialogRef = this.dialog.open(ConfirmDeleteComponent, {
          panelClass: "alert-dialog",
          width: "550px",
          data: {
            rowData: event.node.data,
            title: "Delete Payment",
            delete_item: "payment",
            saveApi:
              this.tableName == "estimate-table"
                ? App.base_url + "updatePFIProduct"
                : "",
            tableName: "payments",
          },
          disableClose: true,
        });
      }
    }

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
      if (result.success) {
        // event.node.setData({ ...event.data, ...result.response });
        this.emitGridEvent.emit({
          editdone: true,
          tableName: this.tableName,
        });
        // this.gridApi.refreshCells({ force: true });
        this.gridApi.purgeServerSideCache([]);

        // this.gridApi.refreshServerSideStore({ purge: true });

        var allColumnIds: any = [];
        // this.gridColumnApi.getAllColumns().forEach(function (column: any) {
        //   // if (column.colId != "amount") {
        //   allColumnIds.push(column.colId);
        //   // }
        // });
        // setTimeout(() => {
        // }, 100);
        setTimeout(() => {
          const allColumnIds = this.gridColumnApi.getAllColumns().map((col) => {
            return col.getColId();
          });
          this.gridColumnApi.autoSizeColumns(allColumnIds);
          this.gridApi.sizeColumnsToFit();
        }, 1000);

        // this.gridApi.refreshCells({ force: true });
        // if (this.gridApi) {
        //   this.gridApi.setColumnDefs(this.colDefs);
        // }
        // setTimeout(() => {
        //   if (this.reminingWidth > 0) {
        //     this.gridColumnApi.setColumnWidth(
        //       "product_description",
        //       this.descriptionActualWidth + this.reminingWidth
        //     );
        //   }
        // }, 100);
      }
    });
  }

  onCustomCellClick(params: any) {
    this.emitGridEvent.emit({ ...params, eventName: "split" });
  }
  gridOptions: any = {
    defaultColDef: {
      flex: 1,
      width: 100,
      resizable: true,
      sortable: true,
      filter: true,
      // draggable: false,
      suppressMovable: true,
      domLayout: "autoHeight",
      // cellClassRules: {
      //   'last-column': (params) => {
      //     const displayedColumns = this.gridColumnApi.getAllDisplayedColumns();
      //     const lastColumn = displayedColumns[displayedColumns.length - 1];
      //     console.log(params.colDef, lastColumn.getColDef())
      //     return params.colDef === lastColumn.getColDef();
      //   }
      // },
      //   cellClass: params => {
      //     const displayedColumns = this.gridColumnApi.getAllDisplayedColumns();
      //     const lastColumn = displayedColumns[displayedColumns.length - 1];
      //     console.log(params.colDef, lastColumn.getColDef())
      //     return params.colDef === lastColumn.getColDef() ? 'my-class-1' : 'my-class-2';
      // },
    },
    rowModelType: "serverSide",
    serverSideStoreType: "partial",
    // cacheBlockSize: 10,
    // maxBlocksInCache: 5,
    animateRows: true,
    context: {
      componentParent: this,
    },
    onRowSelected: this.onRowSelected.bind(this),
    onSelectionChanged: this.onSelectionChanged.bind(this),
    onColumnResized: this.onColumnResized.bind(this),
    isRowSelectable: (node: RowNode) => {
      return this.checkboxSelection(node);
    },
    // loadingOverlayComponent: 'customLoader',
    // loadingOverlayComponentParams: { color: 'blue' }
  };
  public reminingWidth = 0;
  public descriptionActualWidth;
  onColumnResized(ev) {
    if (ev.finished) {
      let totalColumnsWidth = 0;
      ev.columnApi.getAllColumns().forEach((column) => {
        totalColumnsWidth += column.getActualWidth();
        if (column.colId == "product_description") {
          this.descriptionActualWidth = column.getActualWidth();
        }
      });
      // console.log("Total Columns Width:", totalColumnsWidth);
      const gridElement: any = document.querySelector(".ag-root"); // Adjust the selector as per your grid's root element
      if (gridElement) {
        const totalGridWidth = gridElement.offsetWidth;
        // console.log('Total Columns Width:', totalColumnsWidth);
        // console.log('Total Grid Width:', totalGridWidth);
        this.reminingWidth = totalGridWidth - totalColumnsWidth;
      }
    }
  }
  async modifyColumnData(api: any) {
    (await this.colDefs) &&
      this.colDefs.map(async (obj: any) => {
        if (obj.field != "is_order_created" || obj.field != "is_po_created") {
          obj["tooltipValueGetter"] = (params) => params.value;
        }
        obj["maxWidth"] = 300;
        obj["resizable"] = true;
        obj["sortable"] = false;
        // obj["cellClass"] = ["ag-ellipsis"];
        // obj.minWidth = 150;
        if (obj.field == "index" || obj.field == "serial_no") {
          obj.maxWidth = 80;
        }
        // if (obj.field == "uom_name") {
        //   obj.minWidth = 70;
        // }
        obj.pinned = null;

        obj.cellRendererParams = {
          customParams: {
            orders: this.orders,
            originFileAttachments: this.originFileAttachments,
            tableName: this.tableName,
            enableSplit: this.enableSplit,
          },
        };
        if (obj.field === "select_all") {
          obj["cellClass"] = ["checkbox-cell"];
        }
        if (
          obj.field === "is_order_created" ||
          obj.field === "is_po_created" ||
          obj.field === "select_all"
        ) {
          obj["headerComponent"] = "customHeaderComponent";
        }
        if (obj.field === "product_name" || obj.field === "product_quantity") {
          obj.cellRenderer = "productCellRenderer";
        }
        if (
          obj.field === "is_order_created" ||
          obj.field === "is_shipment_created"
        ) {
          obj["headerComponentParams"] = {
            headerIcon: this.images.badge_check,
          };
          obj.cellRenderer = (params: any) =>
            params.data[obj.field]
              ? `<div class="cell-Icon-text" ><img src=${this.images.badge_check} alt='loading' style="width: 20px; height: 20px" class='radius-none'/></div>`
              : `<div style="padding-left: 8px">--</div>`;
        }
        if (obj.field === "is_po_created") {
          obj["headerComponentParams"] = {
            headerIcon: this.images.badge_check_po,
          };
          obj.cellRenderer = (params: any) =>
            params.data[obj.field]
              ? `<div class="cell-Icon-text" ><img src=${this.images.badge_check_po} alt='loading' style="width: 20px; height: 20px" class='radius-none'/></div>`
              : `<div style="padding-left: 8px">--</div>`;
        }

        if (obj.field === "product_name") {
          // if (!obj.product_image) {
          //   obj.cellClass = ["ag-imageCell-text", "ag-cell-padding-left"];
          // }
        }

        if (obj.field === "product_quantity") {
          obj.cellClass = ["ag-qty-split"];
        }
        if (
          obj.field === "product_price" ||
          obj.field === "amount" ||
          obj.field === "product_quantity" ||
          obj.type === "quantity" ||
          obj.type === "price"
        ) {
          obj["headerClass"] = ["header-right"];
          obj["cellClass"] = ["align-right"];
        }
        // console.log(productDescriptionMaxWidth)
        if (
          obj.field === "product_description" ||
          obj.field === "description"
        ) {
          obj.minWidth = 100;
          // obj.maxWidth = 320;
          obj.flex = 2;
          obj["cellClass"] = (params) => {
            if (params.value && params.value.length > 39) {
              return ["ag-ellipsis", "description"];
            } else {
            }
          };
        }
        // if (obj.field === "uom_name") {
        //   obj["headerClass"] = ["header-center"];
        //   obj["cellClass"] = ["align-center"];
        // }
        // if ( obj.field === "select_all") {
        //   obj["headerClass"] = ["checkbox-header-center"];
        //   obj["cellClass"] = ["align-right"];
        // }

        if (obj.field == "is_order_created" || obj.field == "is_po_created") {
          obj.cellClass = ["po_order_created"];
          obj["tooltipValueGetter"] = () => "";
        }
      });
  }
  hasHorizontalScroll(): boolean {
    const gridContainer = document.querySelector(".ag-theme-alpine");
    if (gridContainer) {
      return gridContainer.scrollWidth > gridContainer.clientWidth;
    }
    return false;
  }
  calculateMaxWidth(api) {
    const gridContainer = document.querySelector(".ag-theme-alpine");
    const containerWidth = gridContainer ? gridContainer.clientWidth : 0;

    const otherColumnsWidth =
      this.colDefs &&
      this.colDefs.reduce((acc, col: any) => {
        if (col.field !== "product_description") {
          return acc + (col.width || 0);
        }
        return acc;
      }, 0);

    const defaultMaxWidth = 350;

    const availableWidth = containerWidth - otherColumnsWidth;

    const hasScroll = this.hasHorizontalScroll();
    const headerContainer: any = document.querySelector(
      "#" + this.tableName + " " + ".ag-header-container"
    );
    let remainingwidth = 0;
    if (headerContainer) {
      // console.log(headerContainer.getBoundingClientRect());
      remainingwidth =
        availableWidth -
        (headerContainer.getBoundingClientRect().left +
          headerContainer.getBoundingClientRect().right);
    } else {
      remainingwidth = 0;
    }

    const allColumns = this.gridColumnApi.getAllColumns();
    let totalColumnsWidth = 0;

    allColumns.forEach((column: any) => {
      // console.log(column.actualWidth);
      totalColumnsWidth += column.actualWidth;
    });

    // console.log(this.gridColumnApi, allColumns, totalColumnsWidth);
    return hasScroll ? defaultMaxWidth : remainingwidth + 100;
  }

  public totalSelectd;
  onRowSelected(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.totalSelectd = selectedRows.length;
    // event.node.setSelected( false);
    // console.log("Row selected", event);
    this.emitGridEvent.emit({
      selectedRows: selectedRows,
      eventName: "select-rows",
      totalSelectd: this.totalSelectd,
    });
  }
  public selectedRows = [];
  onSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    // this.selectedRows = selectedRows
    // this.emitGridEvent.emit({selectedRows: selectedRows,eventName: "select-rows"});
    // console.log('Selection changed', event);

    // console.log(event)
    // this.params.node.setDataValue(this.params.colDef.field, checked);
  }
}
