import { Injectable, OnChanges, SimpleChanges } from "@angular/core";
import * as _ from "lodash";
import { LeadsService } from "../leads/leads.service";
import { OrganizationsService } from "./organizations.service";
import { SnakbarService } from "./snakbar.service";
import { AdminService } from "./admin.service";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  saveAttributeProps: any;
  public customFormFields: any;
  public orderId = "";
  public newCustomFormGroup: any;
  constructor(
    private service: LeadsService,
    private organizationsService: OrganizationsService,
    private snackbar: SnakbarService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    const obj = {
      related_to_id: this.orderId ? this.orderId : null,
    };
    this.saveAttributeProps = obj;
  }
  public storesAttributesData = [];
  public module;
  async getOrgStoreAttribute(mod: string) {
    await this.service
      .getOrgStoreAttributeList({
        id: "",
        module: mod,
      })
      .then((response) => {
        if (response.result.success) {
          this.storesAttributesData =
            response.result.data.attributes.base_attributes;
          this.module = response.result.data.attributes.form_id;
        }
      })
      .catch((error) => console.log(error));
  }

  public totalClients = [];
  async getOrganizations() {
    await this.organizationsService
      .getOrganizationsList({ flag: 1, sort: "ASC" })
      .then((response) => {
        if (response.result.success) {
          this.totalClients = response.result.data.organization;
        }
      });
  }

  // async saveStoreAttribute(param: any) {
  //   const value = localStorage.getItem("customFields");
  //   // this.customFormFields = value ? JSON.parse(value) : "";
  //   console.log(param)
  //   const obj = {
  //     related_to_id: param.organization_id ? param.organization_id : "",
  //     system_key: "",
  //     id: param.id ? param.id : "",
  //   };
  //   this.saveAttributeProps = obj;
  //   const meta_data: Array<any> = [];
  //   const mod = localStorage.getItem("moduleName");
  //   if(mod != "add_client" && mod != "add_contact" && mod != "add_address") {
  //     await this.getOrganizations();
  //   }
  //   await this.getOrgStoreAttribute(mod);
  //   if (
  //     param
  //   ) {
  //     for (var prop in param) {
  //       let i = await _.findIndex(<any>this.storesAttributesData, {
  //         form_control_name: prop,
  //       });
  //       meta_data.push({
  //         key: prop,
  //         value: param[prop],
  //         label: i > -1 ? this.storesAttributesData[i].label_name : "",
  //         base_field: i > -1 ? this.storesAttributesData[i].base_field : "",
  //         flag: i > -1 ? this.storesAttributesData[i].key : "",
  //       });
  //     }
  //   }
  //   for (let i = 0; i < meta_data.length; i++) {
  //     if (meta_data[i].flag === "custom_component") {
  //       meta_data.splice(i, 1);
  //     }
  //   }
  //   if(this.totalClients.length) {
  //     this.totalClients.forEach((obj) => {
  //       const indx = _.findIndex(meta_data, {
  //         value: obj.name,
  //       });
  //       if (indx > -1) {
  //         meta_data[indx].value = obj.id;
  //       }
  //     });
  //   }

  //   if (meta_data.length) {
  //     return await this.saveStoreAttributeApi(meta_data);
  //   }
  // }

  // async saveStoreAttributeApi(data) {
  //   let response = ""
  //   let toast: object;
  //   await this.service
  //     .saveAttributes({
  //       ...this.saveAttributeProps,
  //       form_id: this.module,
  //       meta_data: data,
  //     })
  //     .then((response) => {
  //       if (response.result.success) {
  //         // localStorage.clear();
  //         response = response.result.data
  //         console.log(response)
  //         localStorage.removeItem("customFields");
  //         localStorage.removeItem("moduleName");
  //         this.service.sendApiResponse(response);
  //         toast = { msg: "Data saved Successfully", status: "success" };
  //         // this.snackbar.showSnackBar(toast);
  //       } else {
  //         toast = { msg: response.result.message ? response.result.message : "Failed to Save Data", status: "error" };
  //         // this.snackbar.showSnackBar(toast);
  //       }
  //     })
  //     .catch((error) => console.log(error));
  //     return response
  // }

  async saveStoreAttribute(param: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = localStorage.getItem("customFields");
        // this.customFormFields = value ? JSON.parse(value) : "";
        const obj = {
          related_to_id: param.organization_id ? param.organization_id : null,
          id: param.id ? param.id : "",
          module_id: param.module_id ? param.module_id : "",
        };
        this.saveAttributeProps = obj;
        const meta_data: Array<any> = [];
        const mod = param.moduleName;

        await this.getOrgStoreAttribute(mod);
        // console.log(param, this.storesAttributesData);

        // if (param) {
        //   for (var prop in param) {
        //     let i = _.findIndex(<any>this.storesAttributesData, {
        //       form_control_name: prop,
        //     });
        //     meta_data.push({
        //       key: prop,
        //       value: param[prop],
        //       label: i > -1 ? this.storesAttributesData[i].label_name : "",
        //       base_field: i > -1 ? this.storesAttributesData[i].base_field : "",
        //       flag: i > -1 ? this.storesAttributesData[i].key : "",
        //     });
        //   }
        // }

        // for (let i = 0; i < meta_data.length; i++) {
        //   if (meta_data[i].flag === "custom_component") {
        //     meta_data.splice(i, 1);
        //   }
        // }

        meta_data.push(param.form_data);
        // if (this.totalClients.length) {
        //   this.totalClients.forEach((obj) => {
        //     const indx = _.findIndex(meta_data, {
        //       value: obj.name,
        //     });
        //     if (indx > -1) {
        //       meta_data[indx].value = obj.id;
        //     }
        //   });
        // }
        if (param.form_id) {
          this.module = param.form_id;
        }
        if (meta_data.length) {
          const response = await this.saveStoreAttributeApi(meta_data[0]);
          resolve(response);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  saveStoreAttributeApi(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.service
        .saveAttributes({
          ...this.saveAttributeProps,
          form_id: this.module,
          meta_data: data,
          module_id: this.saveAttributeProps.module_id,
        })
        .then((response) => {
          if (response.result.success) {
            // localStorage.clear();
            const result = response.result;
            response = response.result.data;
            localStorage.removeItem("customFields");
            localStorage.removeItem("moduleName");
            this.service.sendApiResponse(response);
            resolve(result);
          } else {
            resolve(response.result);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  getModuleList(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const response = await this.getFormModules();
      resolve(response);
    });
  }
  public modulesList;
  getFormModules() {
    return new Promise((resolve, reject) => {
      this.adminService
        .getModules({})
        .then((response) => {
          if (response.result.success) {
            this.modulesList = response;
            resolve(this.modulesList);
          } else {
            resolve([]);
          }
        })
        .catch((error) => console.log(error));
    });
  }
}
