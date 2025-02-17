import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
} from "@angular/forms";
import { language } from "../../../language/language.module";
import { Images } from "../../../images/images.module";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "lodash";
import { AdminService } from "../../../services/admin.service";
import { SnakbarService } from "../../../services/snakbar.service";

import { AddAutoAttibuteComponent } from "../add-auto-attibute/add-auto-attibute.component";
import { AddNewFormComponent } from "../../add-new-form/add-new-form.component";
import { LeadsService } from "../../../leads/leads.service";

@Component({
  selector: "app-lead-atrbt-detail",
  templateUrl: "./lead-atrbt-detail.component.html",
  styleUrls: ["./lead-atrbt-detail.component.scss"],
})
export class LeadAtrbtDetailComponent implements OnInit, OnChanges {
  @ViewChild("myInput") inputEl: ElementRef;
  @ViewChild("myInput") myInput: ElementRef;
  @ViewChild("valueInput") valueInput: ElementRef;
  @ViewChild("mySelect") mySelect: ElementRef;
  @Input() roles;
  @Output() trigger = new EventEmitter<object>();
  status: Array<object> = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];
  // public dialog: MatDialog;
  public open = false;
  detailsForm: FormGroup;
  fetchingData: boolean;
  noRoles: boolean;
  pointerEvent: boolean;
  randomOptId: any;
  disableCheck: any;
  detailsSubmit: boolean;
  public valStat = true;
  globalPermissions: any;
  addValueform = false;
  systemPermissions: Array<any> = [];
  rolePermissions: Array<any> = [];
  public selectedAttribute: any;
  private language = language;
  public images = Images;
  newRoleAdd = "Add Role";
  searchValue = "";
  originalOrder: Array<any> = [];
  formSubmit = false;
  duplicateError: any;
  disableSave = false;
  public attributes: Array<any> = [];
  availableOptions: any;
  selectedOption: string = "own_options";

  //   public noWhitespaceValidator(control: FormControl) {
  //     console.log('vaewr');
  //     let isWhitespace = (control.value || '').trim().length === 0;
  //     let isValid = !isWhitespace;
  //     return isValid ? null : { 'whitespace': true };
  // }
  dropdowns = {
    attributes: [],
    status: [
      { label: "Active", value: true, param: true },
      { label: "Inactive", value: false, param: false },
    ],
    uiElements: [],
    sizes: [
      { key: "small", label: "Small", length: 255 },
      { key: "medium", label: "Medium", length: 500 },
      { key: "large", label: "Large", length: 1024 },
    ],
    dataTypes: [
      { key: "alphanumeric", label: "Alpha Numeric" },
      { key: "numeric", label: "Numeric" },
      { key: "alphabet", label: "Alphabet" },
    ],
    dateTypes: [],
    decimalDigits: [
      { key: "0", label: "0" },
      { key: "1", label: "1" },
      { key: "2", label: "2" },
      { key: "3", label: "3" },
      { key: "4", label: "4" },
      { key: "5", label: "5" },
    ],
  };
  public inputValidations = [
    // { key: "alphanumeric", label: "Alphanumeric" },
    // { key: "numeric", label: "Numeric" },
    // { key: "alphabets", label: "Alphabets" },
    // { key: "alphabets_with_special_characters", label: "Alphabets with Special Characters" },
    // { key: "numeric_with_special_characters", label: "Numeric with Special Characters" },
    // { key: "email_validation", label: "Email Validation" },
    // { key: "url_validation", label: "URL Validation" },
    // { key: "allow_all_characters", label: "Allow All Characters" },
  ];

  predefinedValueLength = this.dropdowns.sizes[0].length;
  uiElement: any;
  param: object;
  public dependentFieldList = [];
  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    public adminService: AdminService,
    private leadService: LeadsService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.noRoles = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.roles == undefined) {
      this.noRoles = true;
    }
    if (this.roles !== undefined) {
      if (!_.isEmpty(this.roles)) {
        this.dependentFieldList = _.cloneDeep(this.roles.attributelist);
        const indx = _.findIndex(this.dependentFieldList, {
          id: this.roles.id,
        });
        if (indx > -1) {
          this.dependentFieldList.splice(indx, 1);
        }

        this.newRoleAdd = "Update Role";
        this.detailsForm.reset();
        // this.setForm(this.roles);
        // if (this.roles.hasOwnProperty('flag')) {
        //   this.noRoles = true;
        //   this.selectedAttribute = {};
        // } else {
        //   this.setForm(this.roles);
        // }

        this.adminService
          .attributeDetails({ id: this.roles.id })
          .then((response) => {
            this.fetchingData = false;
            if (response.result.success) {
              this.selectedAttribute = response.result.data;
              if (
                this.selectedAttribute.slug == "single_line_text" ||
                this.selectedAttribute.slug == "paragraph_text" ||
                this.selectedAttribute.slug == "number"
              ) {
                this.getValidationTypes();
                this.detailsForm.get("max_file_size").clearValidators();
                this.detailsForm.get("max_file_size").updateValueAndValidity();
                this.detailsForm.get("accepted_formats").clearValidators();
                this.detailsForm
                  .get("accepted_formats")
                  .updateValueAndValidity();
              } else if (
                this.selectedAttribute.slug == "upload" ||
                this.selectedAttribute.slug == "upload_documents"
              ) {
                this.getFormatTypes();
                this.detailsForm
                  .get("max_file_size")
                  .setValidators([Validators.required]);
                this.detailsForm
                  .get("accepted_formats")
                  .setValidators([Validators.required]);
              }
              this.setForm(this.selectedAttribute);
              this.getAttributes({
                ...this.param,
                form_id: this.selectedAttribute.dropdown_from_form_id,
              });

              // this.loadInitials(this.globalPermissions);
              this.uiElement = this.getSelectedFormField(
                this.selectedAttribute.form_element_id
              );
              // this.createUIFormBuilder(this.uiElement);
              this.availableOptions = this.selectedAttribute.option
                ? this.selectedAttribute.option.length
                : 0;
              // console.log(this.selectedAttribute.option)
              //console.log(this.uiElement)
            }
          })
          .catch((error) => console.log(error));
      } else {
        this.pointerEvent = false;
        this.detailsForm.reset();
        this.newRole(true);
        this.noRoles = true;
      }
    } else {
      this.noRoles = true;
    }
  }

  ngOnInit() {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    });

    this.getAttributes(this.param);
    this.createForm();
    this.getGlobalPermissions();
    this.getAllFormFieldTypes();
    this.getAllFormFieldTypes();
    this.getFormModules();
    if (this.adminService.rolePermissions.add_form_builder == 1) {
      this.detailsForm.enable();
    } else if (this.adminService.rolePermissions.add_form_builder == 2) {
      this.detailsForm.disable();
    }
    //this.createUIFormBuilder(1);

    this.detailsForm.valueChanges.subscribe((data) => {});
  }
  getAttributes(param: object, flag?: string, cb?): void {
    this.adminService
      .getAttributes(param)
      .then((response) => {
        // this.searching = false;
        if (response.result.success) {
          this.attributes = response.result.data;
        } else {
          //this.noRoles = true;
        }
      })
      .catch((error) => console.log(error));
  }

  newRole(flag: boolean): void {
    this.newRoleAdd = "Add Role";
    // if (flag) { setTimeout(() => { this.loadInitials(this.globalPermissions); }, 100); }
    this.selectedAttribute = {};
    this.roles = {};
    this.rolePermissions = [];
    this.fetchingData = false;
    this.inputEl.nativeElement.focus();
    if (flag) {
      //console.log('cmnggg');
      this.detailsForm.reset();
      this.detailsForm.markAsPristine();
      this.detailsForm.markAsUntouched();
    }
  }

  setDirty(): void {
    this.detailsForm.markAsDirty();
  }

  // loadInitials(data: any): void {
  //   data.map(child => {
  //     delete child.permission;
  //     delete child.checked;
  //     delete child.selectedValue;
  //     this.rolePermissions.map(getpermission => {
  //       if (getpermission.id === child.id) {
  //         child.checked = _.indexOf(getpermission.permission, 1) > -1 ? true : false;
  //         child.selectedValue = getpermission.permission[0];
  //         child.permission = getpermission.permission;
  //       }
  //     });
  //     if (child.children) {
  //       this.loadInitials(child.children);
  //     }
  //   });
  // }
  public noWhitespaceValidator(control: FormControl) {
    //console.log('fergrege');
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  createForm(): void {
    this.detailsForm = this.fb.group({
      label: [null, [Validators.required, this.noWhitespaceValidator]],
      status: [null, Validators.required],
      description: [null],
      form_element_id: [null],
      label_element_data_type: "",
      dateType: "",
      predefined_value: "",
      selected_value: "",
      option: this.fb.array([]),
      tooltip: "",
      base_field: "",
      suggest_value: [""],
      suggest_status: "",
      required: "",
      is_editable: true,
      display_order: ["", [Validators.pattern(/^[0-9.]+$/)]],
      dependent_on_field_id: "",
      dependent_on_form_id: "",
      dropdown_from_form_id: "",
      form_dropdown_field_id: "",
      method_name: "",
      validation_type_id: "",
      min_length: "",
      max_length: "",
      decimals_accepted: "",
      accepted_formats: [],
      max_file_size: "",
      is_custom_validation: false,
      validation_method: "",
      is_current_date: "",
      form_control_name: "",
      document_mapping: "",
    });

    this.createUIFormBuilder(1);
  }

  get option(): FormArray {
    return this.detailsForm.get("option") as FormArray;
  }

  cancel(form: any): void {
    this.detailsSubmit = false;
    form.markAsPristine();
    this.setForm(this.selectedAttribute);
    //this.loadInitials(this.globalPermissions);
  }
  openAddDialog(data: any) {
    let dialogRef = this.dialog.open(AddAutoAttibuteComponent, {
      panelClass: "add-custom-attributes",
      width: "500px",
      data: data.data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        if (data.afterClosed) {
          // this.adminService.customAttributesCount.next(this.attributes.length + 1);
          data.afterClosed(result);
        }
      }
    });
  }

  addAutoSuggestValue() {
    this.addValueform = true;
    this.openAddDialog({
      data: {
        // orgId: this.orgId,
        //flag: 'add_auto_suggest',
        selectedAttribute: this.selectedAttribute,
      },
      afterClosed: (result) => {
        // console.log(result)
        const afterAdded = () => {
          this.selectedAttribute.option.push({
            id: this.randomId(),
            status: true,
            value: result.data,
          });
          this.addValueform = false;
          this.originalOrder = [...this.selectedAttribute.option];
        };

        if (this.searchValue) {
          this.selectedAttribute.option = [...this.originalOrder];
          afterAdded();
          this.DOMSearch(this.searchValue);
        } else {
          afterAdded();
        }
        this.detailsForm.markAsDirty();
      },
    });
  }

  createRole(form: any): void {
    if (
      this.selectedAttribute.type != "Dropdown" &&
      this.selectedAttribute.type != "Auto Suggest"
    ) {
      this.options.controls.forEach((control) => {
        control.get("value").clearValidators();
        control.get("value").updateValueAndValidity();
      });
    }

    // if(this.selectedAttribute && (this.selectedAttribute.type != 'Auto Suggest' ||this.selectedAttribute.type !=  'Dropdown')) {
    //   this.options.controls.forEach(control => {
    //     control.get("value").clearValidators();
    //     control.get("value").updateValueAndValidity();
    //   });
    // }
    this.detailsSubmit = true;
    // if(this.selectedAttribute && (this.selectedAttribute.type != 'Auto Suggest' ||this.selectedAttribute.type !=  'Dropdown')) {
    //   this.options.controls.forEach(control => {
    //     control.get("value").clearValidators();
    //     control.get("value").updateValueAndValidity();
    //   });
    // }
    let toast: object;
    if (!form.valid) {
      return;
    }

    this.systemPermissions = [];
    this.loadPermissions(this.globalPermissions);
    const param = Object.assign({}, this.detailsForm.value);
    param.id = this.selectedAttribute.id || 0;
    param.system_permissions = this.systemPermissions;
    param.form_id = this.roles.module || this.roles.form_id;
    param.option_type = this.selectedOption;
    this.adminService
      .addAttributes({ ...param })
      .then((response) => {
        if (response.result.success) {
          this.detailsSubmit = false;
          if (param.id) {
            toast = { msg: "Form Updated Succesfully ", status: "success" };
          } else {
            toast = { msg: "Form Added Succesfully ", status: "success" };
          }
          this.selectedAttribute = response.result.data;
          this.trigger.emit({ flag: param.id, data: this.selectedAttribute });
          form.markAsPristine();
        } else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch((error) => console.log(error));
  }

  loadPermissions(data: any): void {
    data?.map((value) => {
      if (
        _.findIndex(this.systemPermissions, { id: value.id }) === -1 &&
        value.permission
      ) {
        if (value.permission.length) {
          this.systemPermissions.push({
            id: value.id,
            permission: value.permission,
          });
        }
      }
      if (value.children) {
        this.loadPermissions(value.children);
      }
    });
  }

  getGlobalPermissions() {
    this.adminService
      .getGlobalPermissions()
      .then((response) => {
        if (response.result.success) {
          this.globalPermissions =
            response.result.data.global_system_permissions;
          // console.log(response)
        }
      })
      .catch((error) => console.log(error));
  }
  getAllFormFieldTypes(): Promise<any> {
    let param = [];
    return this.adminService.allforrmFields(param).then((res) => {
      this.dropdowns.uiElements = res.result.data.items;
      // console.log(this.dropdowns.uiElements)
    });
  }

  getSelectedFormField = (id) => {
    return this.dropdowns.uiElements.find((uiElement) => {
      return uiElement.id === id;
    });
  };
  randomId = () => {
    const rand = Math.random().toString().substr(5);
    return "new_" + rand;
  };
  createChoice = (data?) => {
    // const obj: any = {};
    // if (this.uiElement.template_id === 5) {
    //   obj.delimiter = data ? data.delimiter : "";
    // }

    const choice_id = data && data.id ? data.id : this.randomId();
    // this.randomOptId = choice_id;

    const validt_obj = {
      options: this.options,
      opt_id: choice_id,
    };

    return this.fb.group({
      id: false,
      value: [
        data && data.value ? data.value : "",
        [
          Validators.required,
          Validators.maxLength(100),
          this.noWhitespaceValidator,
          checkDuplicates.bind(validt_obj),
        ],
      ],
      // value: [(data && data.value?data.value:''), Validators.required],
      // status: data.status ? data.status : true,
      status: false,
      // status:this.options.value.status,
      // ...obj,
    });
  };

  addControl = (data = {}) => {
    this.options.push(this.createChoice(data));
    //.log( this.options)
  };

  removeControl = (indx) => {
    if (this.options.length > 1) {
      this.options.removeAt(indx);
    }
  };
  disableType = (tmpId) => {
    this.dropdowns.uiElements.map((type) => {
      if (type.template_id === tmpId) {
        type.disable = false;
      } else {
        type.disable = true;
      }
    });
  };
  focusElement = (control, data) => {
    const value = control === "suggest_value" ? data.value : data.status;
    this.detailsForm.get(control).setValue(value);
    setTimeout(() => {
      if (control === "suggest_value") {
        this.valueInput.nativeElement.focus();
      } else {
        this.mySelect.nativeElement.focus();
      }
    }, 200);
  };

  changeLength(selectedVal) {
    this.predefinedValueLength = this.dropdowns.sizes.find((s) => {
      return s.key === selectedVal;
    }).length;
  }
  DOMSearch1 = (val) => {
    if (val) {
      const searchValues = val.toLowerCase();
      this.searchValue = val;
      this.selectedAttribute.option = this.originalOrder.filter((o) => {
        return o.value.toLowerCase().indexOf(searchValues) > -1;
      });
    } else {
      this.searchValue = "";
      this.selectedAttribute.option = [...this.originalOrder];
    }
    // if (this.value.sortBy) this.DOMSort('value', 'no-change');
    // if (this.status.sortBy) this.DOMSort('status', 'no-change');
  };
  DOMSearch = (val) => {
    //this.originalOrder = [...this.selectedAttribute.option];
    // console.log(this.originalOrder )
    if (val) {
      let searchValues = val.target.value;
      this.searchValue = val.target.value;
      //  console.log( searchValues)
      //  console.log(this.selectedAttribute.option,this.originalOrder)
      this.selectedAttribute.option = this.originalOrder.filter((o) => {
        return o.value.indexOf(searchValues) > -1;
      });
    } else {
      this.searchValue = "";
      this.selectedAttribute.option = [...this.originalOrder];
      //console.log(this.selectedAttribute.option)
    }
    // if (this.value.sortBy) this.DOMSort('value', 'no-change');
    // if (this.status.sortBy) this.DOMSort('status', 'no-change');
  };

  onChangeOption = (flag, ev, data) => {
    if (flag === "status") {
      data.status = ev.target.value === "false" ? false : true;
      delete data.showStatus;
    } else {
      const value_index = this.selectedAttribute.option.findIndex((v) => {
        return (
          v.value.toLowerCase().trim() === ev.target.value.toLowerCase().trim()
        );
      });
      if (ev.target.value.trim() && value_index === -1) {
        data.value = ev.target.value;
      }
      delete data.showValue;
    }
    this.DOMSearch(this.searchValue);
  };

  // addAutoSuggestValue(): void {
  //   let toast: object;
  //   let dialogRef = this.dialog.open(AddAutoAttibuteComponent, {
  //     panelClass: 'alert-dialog',
  //     width: '500px',
  //     data:{
  //       flag: 'add_attribute',
  //     }

  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(result)
  //     if (result.success) {
  //       toast = { msg: "Attribute Added successfully.", status: "success" };
  //      // this.getAttributes(this.param);
  //       this.snackbar.showSnackBar(toast);

  //     }
  //   });
  // }
  createUIFormBuilder = (ui) => {
    // console.log(this.selectedAttribute.option)
    //   if (this.selectedAttribute.option.length) {
    //     this.selectedAttribute.option.map((option) => {
    //       this.addControl(option);
    //     });
    //   } else {
    this.addControl();

    //  this.selectedAttribute.predefined_value = this.randomOptId;
    // }

    // if (this.selectedAttribute.type === "Custom Component") {
    //   this.disableCheck = true;
    // } else {
    //   this.disableCheck = false;
    // }
    // this.disableType(ui.template_id);
  };
  setForm(data: any): void {
    // console.log(data.status)
    this.detailsForm.patchValue({
      label: data.label,
      description: data.description,
      status: data.status,
      form_element_id: data.form_element_id,
      predefined_value: data.predefined_value || "",
      selected_value: data.selected_value || "",
      label_element_data_type: data.label_element_data_type || "",
      option: data.option || [],
      tooltip: data.tooltip,
      dateType: data.dateType,
      base_field: data.base_field,
      required: data.required,
      is_editable: data.is_editable,
      display_order: data.display_order || "",
      dependent_on_form_id: data.dependent_on_form_id,
      dropdown_from_form_id: data.dropdown_from_form_id,
      form_dropdown_field_id: data.form_dropdown_field_id,
      method_name: data.method_name,
      dependent_on_field_id: data.dependent_on_field_id,
      validation_type_id: data.validation_type_id,
      min_length: data.min_length,
      max_length: data.max_length,
      decimals_accepted: data.decimals_accepted,
      accepted_formats: data.accepted_formats,
      max_file_size: data.max_file_size,
      is_custom_validation: data.is_custom_validation,
      validation_method: data.validation_method,
      is_current_date: data.is_current_date,
      form_control_name: data.form_control_name,
      document_mapping: data.document_mapping,
    });
    if (data.option_type) {
      this.onSelectionChange(data.option_type);
    } else {
      this.onSelectionChange("");
    }
    this.selectedOption = data.option_type;
  }
  get options() {
    return this.detailsForm.get("option") as FormArray;
  }
  get af() {
    return this.detailsForm.controls;
  }
  saveAttributes(form) {
    let toast: object;

    this.formSubmit = true;

    this.duplicateError = "";
    if (form.value.option.length === 1) {
      form.value.predefined_value = form.value.option[0].id;
      form.value.option["is_default"] = true;
    }

    // if (form.valid) {
    if (form.value.option.length) {
      form.value.option.map((val) => {
        if (val.id === form.value.predefined_value) {
          val["is_default"] = true;
        } else {
          val["is_default"] = false;
        }
      });
    }

    form.value.attr_id = this.selectedAttribute.id;
    // console.log(this.selectAttribute);
    if (this.selectedAttribute.form_element_id === 2) {
      form.value.label_element_data_length = this.predefinedValueLength;
      form.value.predefined_value = form.value.predefined_value;
    } else if (this.selectedAttribute.form_element_id === 3) {
      form.value.option = [...this.originalOrder];
    }
    form.value.key = this.selectedAttribute.key;
    this.disableSave = true;
    this.adminService.addAttributes(form.value).then((res) => {
      if (res.result.success && res.result.data.id) {
        ////this.resetAttributesFormFlags();
        toast = { msg: "Attribute saved successfully.", status: "success" };
        this.snackbar.showSnackBar(toast);
        // if (this.globalAttribute) {
        //   this.organisationService.saveAttributeData(res.result.data);
        //   this.checkMenuPromise(() => {
        //     this.globalAttribute = this.organisationService.getAttributeData(this.orgId, this.paramAttributeId);
        //     // console.log("get")
        //     this.selectAttribute(this.globalAttribute);f
        //   });
        // } else {

        //   const attr_index = this.attributes.findIndex(a => {
        //     return a.id === this.selectedAttribute.id;
        //     // return a.key == this.selectedAttribute.key;
        //   });

        //   // this.attributes[attr_index].id = res.result.data.id;

        //   this.attributes[attr_index].label = res.result.data.label;
        //   this.attributes[attr_index].key = res.result.data.key;
        //   this.selectAttribute(this.attributes[attr_index]);
        // }
      } else {
        this.disableSave = false;
        this.duplicateError = res.result.data;
      }
    });
    //}
  }
  modulesList = [];
  getFormModules() {
    this.adminService
      .getModules({})
      .then((response) => {
        if (response.result.success) {
          this.modulesList = response.result.data.modulesDt;
        }
      })
      .catch((error) => console.log(error));
  }
  public showModuleList = false;
  moduleSelect(event) {
    this.showModuleList = true;
    const param = {
      form_id: event.value,
    };
    this.getAttributes(param);
  }

  onSelectionChange(value: any) {
    this.selectedOption = value;

    if (value == "from_api") {
      this.detailsForm.get("method_name").setValidators([Validators.required]);
      this.detailsForm.get("method_name").updateValueAndValidity();

      this.detailsForm.get("dropdown_from_form_id").clearValidators();
      this.detailsForm.get("form_dropdown_field_id").clearValidators();
      this.detailsForm.get("dropdown_from_form_id").updateValueAndValidity();
      this.detailsForm.get("form_dropdown_field_id").updateValueAndValidity();

      this.options.controls.forEach((control) => {
        control.get("value").clearValidators();
        control.get("value").updateValueAndValidity();
      });
    } else if (value == "from_modules") {
      this.detailsForm
        .get("dropdown_from_form_id")
        .setValidators([Validators.required]);
      this.detailsForm
        .get("form_dropdown_field_id")
        .setValidators([Validators.required]);
      this.detailsForm.get("dropdown_from_form_id").updateValueAndValidity();
      this.detailsForm.get("form_dropdown_field_id").updateValueAndValidity();

      this.detailsForm.get("method_name").clearValidators();
      this.detailsForm.get("method_name").updateValueAndValidity();

      this.options.controls.forEach((control) => {
        control.get("value").clearValidators();
        control.get("value").updateValueAndValidity();
      });
    } else if (value == "own_options") {
      this.detailsForm.get("option").setValidators([Validators.required]);

      this.detailsForm.get("method_name").clearValidators();
      this.detailsForm.get("method_name").updateValueAndValidity();

      this.detailsForm.get("dropdown_from_form_id").clearValidators();
      this.detailsForm.get("form_dropdown_field_id").clearValidators();
      this.detailsForm.get("dropdown_from_form_id").updateValueAndValidity();
      this.detailsForm.get("form_dropdown_field_id").updateValueAndValidity();
      this.options.controls.forEach((control) => {
        control.get("value").setValidators([Validators.required]);
        control.get("value").updateValueAndValidity();
      });
    } else {
      this.detailsForm.get("method_name").clearValidators();
      this.detailsForm.get("method_name").updateValueAndValidity();
      this.detailsForm.get("dropdown_from_form_id").clearValidators();
      this.detailsForm.get("form_dropdown_field_id").clearValidators();
      this.detailsForm.get("dropdown_from_form_id").updateValueAndValidity();
      this.detailsForm.get("form_dropdown_field_id").updateValueAndValidity();
      this.options.controls.forEach((control) => {
        control.get("value").clearValidators();
        control.get("value").updateValueAndValidity();
      });
    }

    // console.log(this.detailsForm);
    // Add any additional logic here
  }
  onSelect(index: number): void {
    this.options.controls.forEach((control, i) => {
      if (i !== index) {
        control.get("id").setValue(false);
      } else {
        control.get("id").setValue(true);
      }
    });
  }
  onDependencyFieldChange(ev) {}

  addNewForm() {
    let dialogRef = this.dialog.open(AddNewFormComponent, {
      panelClass: "add-custom-attributes",
      width: "600px",
      data: {},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
      }
    });
  }

  getValidationTypes() {
    const param = {
      slug: this.selectedAttribute.slug,
    };
    this.leadService.getValidationTypesAdmin(param).then((res) => {
      if (res.result && res.result.success) {
        this.inputValidations = res.result.data;
      }
    });
  }
  public formatList = [];
  getFormatTypes() {
    const param = {
      slug: this.selectedAttribute.slug,
    };
    this.leadService.getFormatTypes(param).then((res) => {
      if (res.result && res.result.success) {
        this.formatList = res.result.data;
      }
    });
  }
  onValidationTypeChange(event: any) {
    this.selectedAttribute.validation_type_slug = event.slug;
  }

  getClientName(clientId: string, options): string {
    const client = options.find((client) => client.slug === clientId);
    return client ? client.label : "";
  }

  removeClient(clientId: string, selectedList): void {
    const selectedClients = selectedList.filter((id) => id !== clientId);
    this.detailsForm.patchValue({
      accepted_formats: selectedClients,
    });
  }
  onMinChange(event) {
    if (
      this.selectedAttribute.slug == "single_line_text" ||
      this.selectedAttribute.slug == "paragraph_text"
    ) {
      this.detailsForm
        .get("max_length")
        .setValidators([Validators.min(parseInt(event.target.value) + 1)]);
    }
  }
  onMaxChange(event) {
    if (
      this.selectedAttribute.slug == "single_line_text" ||
      this.selectedAttribute.slug == "paragraph_text"
    ) {
      this.detailsForm
        .get("min_length")
        .setValidators([Validators.max(parseInt(event.target.value) - 1)]);
    }
  }
  public showValidationField = false;
  onChangeCustValidation(event) {
    this.showValidationField = event.checked;
    if (this.showValidationField) {
      this.detailsForm
        .get("validation_method")
        .setValidators([Validators.required]);
    } else {
      this.detailsForm.get("validation_method").clearValidators();
    }
    this.detailsForm.get("validation_method").updateValueAndValidity();
  }
}
export function checkDuplicates(control: AbstractControl) {
  const opts = this.options.value;
  const option_index = opts.findIndex((o) => {
    return o.id === this.opt_id;
  });

  const dup_index = opts.findIndex((o) => {
    //return control.value
    // console.log(control.value)
    return control.value && o.value === control.value;
  });

  // this.options.controls.map((o) => {
  //   o.controls.value.updateValueAndValidity();
  // });

  if (dup_index !== option_index && dup_index > -1) {
    return { duplicateOption: true };
  }

  return null;
}
