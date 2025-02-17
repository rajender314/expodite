import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Images } from '../../images/images.module';

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  selectedProduct: object;
  updatedProductDetails: object;
  categoryData: Array<any> = [];
  public images = Images;

  constructor(public adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    });
  }
  getSelectedProductType(data: any): void {
    // console.log(data.status)
    if (data.status == undefined) {
      data.status = true;
    }
    if (data) this.selectedProduct = data;
    else this.selectedProduct = {};
  }

  updateProductDetails(result): void {
    console.log(result);
    this.updatedProductDetails = {
      id: result.flag,
      delete: result.delete ? result.delete : false,
      result: result.data,
    };
    // console.log(this.updatedProductDetails)
  }
  getCategoryList(result): void {
    // console.log(result)
    this.categoryData = result;

    // this.categoryData = this.categoryData.filter(obj => {
    //   return obj.status
    // })
    // console.log(this.categoryData)
  }
}
