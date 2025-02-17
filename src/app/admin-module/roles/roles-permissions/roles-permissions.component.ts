import {
  Component,
  OnInit,
  Input,
  DoCheck,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import * as _ from "lodash";
import { language } from "../../../language/language.module";
import { RolesDetailsComponent } from "../roles-details/roles-details.component";
import { AdminService } from "../../../services/admin.service";
import { Images } from "../../../images/images.module";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: "app-roles-permissions",
  templateUrl: "./roles-permissions.component.html",
  styleUrls: ["./roles-permissions.component.scss"],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('collapsed', style({ height: '0px', opacity: 1, overflow: 'hidden' })),
      transition('expanded <=> collapsed', [animate('300ms ease-in-out')])
    ])
  ]
})
export class RolesPermissionsComponent implements OnInit, DoCheck {
  @Input() permission;
  @Input() permissionDeps;
  private language = language;
  public images = Images;
  public globalPermissions: any = [];
  @Input() totalChecked;
  @Output() trigger = new EventEmitter<any>();
  constructor(
    private parent: RolesDetailsComponent,
    public adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.adminService.getGlobalPerm().subscribe((res) => {
      this.globalPermissions = res;
    });

    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    if (
      this.permission.level==1
    ) {
      this.permission.isExpanded = false;
      // this.collapseOtherPermissions(this.permission.children);
    } else {
      this.permission.isExpanded = true;
    }
  }
  toggleAccordion(permission: any) {
    permission.isExpanded = !permission.isExpanded;
  }
  collapseOtherPermissions(permissions: any[]) {
    permissions.forEach((child, index) => {
      if (index !== 0) {
        child.isExpanded = false;
      }
    });
  }
  ngDoCheck(): void {
    if (this.permission.type === "check" && this.permission.checked === true) {
      if (this.permission.children) {
        this.permission.checked = this.permission.children.some(
          (child) => child.checked
        );
        if (!this.permission.checked) {
          this.permission.permission = [];
        }
      }
    }
  }
  ngOnChanges(change) {
      // this.updateSelectedValue(this.globalPermissions);
  }

  updateSelectedValue(arr: any[]) {
    arr.forEach((obj) => {
      if (Array.isArray(obj.children)) {
        // Recursively process children
        this.updateSelectedValue(obj.children);
      }
      // Set the selectedValue
      obj.selectedValue = this.totalChecked ? 1 : 2;
      obj.permission = this.totalChecked ? [1] : [2];
    });
  }

  setDirty(): void {
    this.parent.setDirty();
  }

  //    findObjectInNestedArray(array, predicate) {
  //     for (const obj of array) {
  //         if (predicate(obj)) {
  //             return obj; // Return the object if it matches the condition
  //         }
  //         if (obj.children && Array.isArray(obj.children)) {
  //             const found = this.findObjectInNestedArray(obj.children, predicate);
  //             if (found) return found; // Return if found in children
  //         }
  //     }
  //     return null; // Return null if not found
  // }

  findAllObjectsInNestedArray(array, predicate) {
    let result = [];

    for (const obj of array) {
      if (predicate(obj)) {
        result.push(obj); // Add the object if it matches the condition
      }
      if (obj.children && Array.isArray(obj.children)) {
        result = result.concat(
          this.findAllObjectsInNestedArray(obj.children, predicate)
        );
      }
    }

    return result;
  }

  updateNestedArray(array, predicate, updater) {
    return array.map((obj) => {
      const updatedObj = predicate(obj) ? { ...obj, ...updater(obj) } : obj;

      if (updatedObj.children && Array.isArray(updatedObj.children)) {
        // Recursively update all children
        updatedObj.children = this.updateNestedArray(
          updatedObj.children,
          predicate,
          updater
        );
      }

      return updatedObj;
    });
  }

  check(item, option, event): void {
    // console.log(item, option, event);
    // console.log(this.globalPermissions);

    this.setDirty();

    if (item.type === "check") {
      item.permission = _.indexOf(item.permission, 1) > -1 ? [] : [1];
      item.checked = _.indexOf(item.permission, 1) > -1;
    } else if (item.type === "select" || item.type === "radio") {
      item.permission = [event.value];
      item.selectedValue = event.value;

      const targetCodes =
        this.adminService.permissionDeps[event.value][item.code];
      // Update nested array and replace globalPermissions reference
      this.globalPermissions = this.updateNestedArray(
        this.globalPermissions,
        (obj) => targetCodes.includes(obj.code),
        (obj) => ({ permission: [event.value], selectedValue: event.value })
      );
    }
    this.globalPermissions = [...this.globalPermissions];
    this.adminService.setGlobalPerm(this.globalPermissions);
    this.cdr.detectChanges();
  }

  checkChild(data, parent): void {
    console.log(parent);
    data.map((child) => {
      if (parent.type === "check") {
        child.checked = parent.checked;
        child.selectedValue = parent.checked === true ? 1 : 3;
        child.permission = parent.checked === true ? [1] : [];
      } else if (parent.type === "select" || parent.type === "radio") {
        child.checked = parent.selectedValue === 1 ? true : false;
        child.selectedValue = parent.selectedValue;
        child.permission = [parent.selectedValue];
      }
      if (data.children) {
        this.checkChild(child.children, child);
      }
    });
  }
}
