import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray } from "@angular/forms";
import { _ } from "ag-grid-community";
import { ProductsImportComponent } from "../../estimates-module/products-import/products-import.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-packing-details-table",
  templateUrl: "./packing-details-table.component.html",
  styleUrls: ["./packing-details-table.component.scss"],
})
export class PackingDetailsTableComponent implements OnInit {
  @Input() packageTable: any = [];
  @Output() addPackage = new EventEmitter();
  @Output() importEvent = new EventEmitter();
  @Input() order_Permissions: any;

  public shipmentId = "";
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public adminService: AdminService
  ) {
    this.activatedRoute.params.subscribe((param) => {
      this.shipmentId = param.shipmentId;
    });
  }

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
  }
  displayedColumns(data) {
    return data?.map((col) => col.field);
  }
  editPackage(id) {
    this.addPackage.emit({ id: id });
  }
  uploadPacking() {
    let dialogRef = this.dialog.open(ProductsImportComponent, {
      width: "550px",
      data: {
        clickedFrom: "add_packing",
        module: "open_format_upload",
        type: "",
        shipmentID: this.shipmentId,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result.success) {
        this.importEvent.emit({ success: true });
      }
    });
  }
}
