import { animate, style, transition, trigger } from "@angular/animations";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Images } from "../../images/images.module";
import { language } from "../../language/language.module";
import { OrdersService } from "../../services/orders.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatStepper } from "@angular/material/stepper";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import { LeadsService } from "../../leads/leads.service";
import { AdminService } from '../../services/admin.service';
declare var App: any;
const {
  language: {
    estimate: { value: estimate_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-insurance-details",
  templateUrl: "./insurance-details.component.html",
  styleUrls: ["./insurance-details.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("ordersAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class InsuranceDetailsComponent implements OnInit {
  params = {
    pageSize: 25,
    page: 1,
    search: "",
  };
  public images = Images;
  public language = language;
  data = {
    estimate_id: "",
    search: this.params.search,
    pageSize: this.params.pageSize,
    page: this.params.page,
  };
  public estimateslanguage = estimate_name;
  public reportsFooter: boolean = false;
  public showSavePanel = false;
  public editable: boolean;
  public fetchingData: boolean = true;
  public editForm: FormGroup;
  public selectedInsuranceList = [];
  public PolicyNumber: string;
  public PolicyName: string;

  public selectedClientDetail: Array<any> = [];
  editFormData: object;
  public EditIcon: string =
    App.public_url + "signatures/assets/images/edit_1.png";
  currency: any;
  public disableBtn = false;

  constructor(
    private titleService: Title,
    private OrdersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    private snackbar: SnakbarService,
    private leadService: LeadsService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.activatedRoute.params.subscribe(
      (param) => (this.data.estimate_id = param.id)
    );
    this.titleService.setTitle(App["company_data"].insuranceTitle);
    this.getViewDetails(this.data.estimate_id, "insurance_details");
    this.getInsurnceUsedDetails();
  }
  public selecedCurrency = "";
  public balanceAmount = "";
  getInsurnceUsedDetails() {
    const params = {
      name: "insurance_used",
      selectedNumber: this.data.estimate_id,
    };
    this.leadService.getGridList(params).then((response) => {
      if (response.result.success) {
        const res = response.result.data;
        this.balanceAmount = res.insurance_balance;
        this.currency = res.currency;
        this.selectedClientDetail = res.total_data;
        if (this.selectedClientDetail.length) {
          this.selecedCurrency = this.selectedClientDetail[0].currency;
        } else {
          this.selecedCurrency = "--";
        }
      }
    });
  }
  public moduleName = "";
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.editForm = ev.form;
    if (this.editForm.dirty) {
      this.showSavePanel = true;
    }
  }
  public isLoading = true;
  getViewDetails(id, type: string, update?: boolean) {
    if (!update) {
      this.fetchingData = true;
    }
    this.OrdersService.getViewDetails({ id, type }).then((response) => {
      if (response.result.data && response.result.success) {
        this.selectedInsuranceList = response.result.data.add_insurance;
        this.PolicyNumber = this.selectedInsuranceList[0].policy_number;
        this.PolicyName = this.selectedInsuranceList[0].policy_name;
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });
    this.fetchingData = false;
  }
  goBack() {
    this.router.navigate(["/insurance"]);
  }
  editInventory(): void {
    if (!this.editable) this.editable = true;
  }

  update() {
    this.disableBtn = true;
    let toast: object;
    let param: any = {
      form_data: this.editForm.value.storeCustomAttributes[0],
      id: this.data.estimate_id,
      moduleName: this.moduleName,
    };
    if (!this.editForm.valid) return;
    this.isLoading = true;
    this.utilsService
      .saveStoreAttribute(param)
      .then((res) => {
        this.disableBtn = false;
        if (res.success) {
          this.showSavePanel = false;
          this.editable = false;
          this.getViewDetails(this.data.estimate_id, "insurance_details");
          toast = { msg: "Insurance Updated Successfully.", status: "success" };
          this.snackbar.showSnackBar(toast);
        } else {
          this.isLoading = false;

          toast = {
            msg: res.message ? res.message : "Unable to Update",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
        }
      })
      .catch((error) => {
        console.error(error);
        this.isLoading = true;
      });
  }
  resetInsurance(form: any) {
    this.editInventory();
    this.editable = false;
    this.showSavePanel = false;
  }
  public currentTabIndex = 0;
  onTabChange(index: number) {
    this.currentTabIndex = index;
    if (this.currentTabIndex == 1) {
      this.getInsurnceUsedDetails();
    }
  }
}
