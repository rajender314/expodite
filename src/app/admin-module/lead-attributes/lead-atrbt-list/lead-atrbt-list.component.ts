import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  SimpleChange,
  Input,
} from "@angular/core";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { AdminService } from "../..//../services/admin.service";
import { SnakbarService } from "../../../services/snakbar.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AddAttributeComponent } from "../add-attribute/add-attribute.component";
import { Param } from "../../../custom-format/param";
import { language } from "../../../language/language.module";
import * as _ from "lodash";
import { Images } from "../../../images/images.module";

@Component({
  selector: "app-lead-atrbt-list",
  templateUrl: "./lead-atrbt-list.component.html",
  styleUrls: ["./lead-atrbt-list.component.scss"],
  animations: [
    trigger("AdminListAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class LeadAtrbtListComponent implements OnInit {
  public images = Images;
  searching: boolean;
  public open = false;
  public language = language;
  totalPages: number = 0;
  public formSpecType = 2;
  public modeselect = "option2";
  public moduleSelect:number;
  public showAdd = false;
  noAttributes: boolean;
  selectedAttribute: object;
  public input: any;
  public formSpecTypes = [
    { id: 1, name: "Custom Attributes" },
    { id: 2, name: "Default Attributes" },
  ];
  public modulesList: Array<any> = [];

  @Input() update;
  @Output() trigger = new EventEmitter<object>();

  public attributes: Array<any> = [];
  private param: Param = {
    page: 1,
    perPage: 25,
    sort: "ASC",
    search: "",
  };
  constructor(
    private snackbar: SnakbarService,
    public adminService: AdminService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.getFormModules();
  }
  add(type: any): void {
    if (type == 1) {
      this.showAdd = true;
      this.input = Object.assign({ base_field: false }, this.param);
      this.getAttributes(this.input);
    } else {
      if (type == 2) {
        this.showAdd = false;
        this.input = Object.assign({ base_field: true }, this.param);
        this.getAttributes(this.input);
      }
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {
      if (this.update.id) {
        let roles = [];
        this.attributes.map((role) => {
          if (role.id === this.update.id) {
            roles.push(this.update.result);
          } else {
            roles.push(role);
          }
        });
        this.attributes = roles;
        this.selectedAttribute = _.find(this.attributes, {
          id: this.update.id,
        });
        const obj = { ...this.selectedAttribute, form_id: this.moduleSelect, attributelist: this.attributes };
        this.trigger.emit(obj);
      } else {
        // this.noRoles = false;
        // this.totalCount = this.totalCount + 1;
        this.attributes.unshift(this.update.result);
        this.selectedAttribute = this.update.result;
        const obj = { ...this.selectedAttribute, form_id: this.moduleSelect, attributelist: this.attributes };
        this.trigger.emit(obj);
      }
    }
  }
  getAttributes(param: object, flag?: string, cb?): void {
    param = Object.assign({ form_id: this.moduleSelect }, param);
    this.adminService
      .getAttributes(param)
      .then((response) => {
        this.searching = false;
        if (response.result.success) {
          this.attributes = response.result.data;
          if (response.result.data.length) {
            this.getRole(response.result.data[0]);
            this.noAttributes = false;
          } else {
            this.noAttributes = true;
            this.getRole(response.result.data[0]);
          }
        }
      })
      .catch((error) => console.log(error));
  }

  addAttributes(): void {
    let toast: object;
    let dialogRef = this.dialog.open(AddAttributeComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      data: {
        flag: "add_attribute",
        form_id: this.moduleSelect,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        toast = { msg: "Attribute Added successfully.", status: "success" };
        this.getAttributes(this.param);
        this.snackbar.showSnackBar(toast);
      }
      // else{
      //   toast = { msg:" Attribute name already exists.", status: 'error' };
      //   this.snackbar.showSnackBar(toast);
      // }
    });
  }
  getRole(data?: any): void {
    // this.noRoles = false;

    this.selectedAttribute = { ...data, module: this.moduleSelect, attributelist: this.attributes } || {};
    this.trigger.emit(this.selectedAttribute);
    // console.log(this.selectedAttribute)
  }
  private timeout;

  searchAttributes(search: string, event?: any): void {
    this.input.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getAttributes(this.input, "search", () => {});
    }, 1000);
  }
  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getAttributes(this.param, "pagination");
    }
  }

  changeModule(type: number): void {
    this.moduleSelect = type;
    this.modeselect = "option2";
    this.input = Object.assign(
      { base_field: this.modeselect == "option1" ?false : true},
      { module: type },
      this.param
    );
    this.getAttributes(this.input);
  }

  getFormModules() {
    this.adminService
      .getModules({})
      .then((response) => {
        this.searching = false;
        if (response.result.success) {
          this.modulesList = response.result.data.modulesDt;
          this.moduleSelect = this.modulesList[0].id;
          this.add(2);

        }
      })
      .catch((error) => console.log(error));
  }
}
