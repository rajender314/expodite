import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from "@angular/core";
import { language } from "../../../language/language.module";
import { Images } from "../../../images/images.module";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { AdminService } from "../../../services/admin.service";
import * as _ from "lodash";
import { SnakbarService } from "../../../services/snakbar.service";
@Component({
  selector: "app-document-template-details",
  templateUrl: "./document-template-details.component.html",
  styleUrls: ["./document-template-details.component.scss"],
})
export class DocumentTemplateDetailsComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() documentData;
  @Output() trigger = new EventEmitter<object>();
  @Output() injectDocumentTemplates = new EventEmitter<object>();

  private language = language;
  addTemplate = "Add Category";
  private images = Images;
  documentTemplate: FormGroup;
  public noDataFound: boolean = false;
  public saveDocument: boolean = false;
  public fetchingData: boolean = false;
  submmitDcoumentcontent: boolean;
  selectedDocument;
  copyFormArray: any;
  addDocument: boolean = false;
  public typeOfDocument: any;
  // = [
  //   {
  //     id: 1,
  //     name: "Invoices",
  //     code: "invoice",
  //   },
  //   {
  //     id: 2,
  //     name: "Pre Shipping",
  //     code: "pre_shipping",
  //   },
  //   {
  //     id: 3,
  //     name: "Post Shipping",
  //     code: "post_shipping",
  //   },
  // ];
  statuses = [
    {
      id: 1,
      name: "Active",
      code: true,
    },
    {
      id: 2,
      name: "Inactive",
      code: false,
    },
  ];
  isModuleSelectEnabled: boolean = false; // Controls checkbox state
  selectedModule: string | null = null; // Tracks selected dropdown value
  public modulesList: Array<any> = [];
  public modeselect = "option2";
  public moduleSelect: number;
  // public document_body;
  constructor(
    private formBuilder: FormBuilder,
    public adminService: AdminService,
    private snackbar: SnakbarService
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.generateDocumentTemplate();
    this.getDocumentTemplateTypes();

    if(this.adminService.rolePermissions.add_document_template == 1) {
      this.documentTemplate.enable();
    } else if(this.adminService.rolePermissions.add_document_template == 2) {
      this.documentTemplate.disable();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.noDataFound = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.documentData != undefined)
      if (!_.isEmpty(this.documentData)) {
        this.addTemplate = "Update Document";
        this.documentTemplate.reset();
        if (this.documentData.hasOwnProperty("flag")) {
          this.noDataFound = true;
          this.selectedDocument = {};
        } else {
          this.noDataFound = false;
          this.fetchingData = false;
          this.selectedDocument = this.documentData;
          this.setForm(this.documentData);
          this.newContainer(false);
        }
      } else {
        this.noDataFound = false;
        this.newContainer(true);
      }
  }

  getDocumentTemplateTypes() {
    this.adminService
      .getDocumentTemplateTypes()
      .then((response) => {
        if (response.result.success) {
          this.typeOfDocument = response.result.data;
          this.injectDocumentTemplates.emit(this.typeOfDocument);
        }
      })
      .catch((error) => console.log(error));
  }

  newContainer(flag: boolean): void {
    if (flag == true) {
      this.submmitDcoumentcontent = false;
      this.addTemplate = "Add Template";
      this.inputEl?.nativeElement.focus();
      this.addDocument = true;
      this.selectedDocument = {};
      this.documentData = {};
      this.fetchingData = false;
      this.documentTemplate.patchValue({
        name: "",
        status: true,
        document_template_types_id: "",
        document_body: "",
        default_template_id: "",
        display_order: "",
        is_editable: false,
        form_id: null,
        document_header: true,
        document_footer: true,
      });
      this.adminService
        .getDocumentDefaultTemplates({ perPage: 0 })
        .then((response) => {
          this.copyFormArray = response.result.data;
          console.log({ copyFormArray: this.copyFormArray });
        })
        .catch((error) => console.log(error));
    } else {
      this.addDocument = false;
    }
  }

  generateDocumentTemplate() {
    this.documentTemplate = this.formBuilder.group({
      name: [null, [Validators.required]],
      status: [null],
      document_template_types_id: [null, [Validators.required]],
      document_body: [null],
      default_template_id: [null],
      display_order: [null, [Validators.required]],
      is_editable: false,
      form_id: [null],
      document_header: [null],
      document_footer: [null],
    });
  }
  setForm(data: any) {
    this.documentTemplate.patchValue({
      name: data && data.name ? data.name : "",
      status: data ? data.status : "",
      document_body: data && data.document_body ? data.document_body : "",
      id: data && data.id ? data.id : "",
      document_template_types_id:
        data && data.document_template_types_id
          ? data.document_template_types_id
          : "",
      display_order: data && data.display_order ? data.display_order : "",
      is_editable: data && data.is_editable ? data.is_editable : "",
      form_id: data && data.form_id ? data.form_id : "",
      document_header: data && data.document_header ? data.document_header : "",
      document_footer: data && data.document_footer ? data.document_footer : "",
    });
  }
  setDirty(): void {
    this.documentTemplate.markAsDirty();
  }
  cancel(form) {
    this.submmitDcoumentcontent = false;
    form.markAsPristine();
    this.setForm(this.selectedDocument);
  }
  createDocument(form): void {
    form.get("name").markAsTouched({ onlySelf: true });
    form.get("document_template_types_id").markAsTouched({ onlySelf: true });
    this.submmitDcoumentcontent = true;
    let toast: object;
    let param = Object.assign({}, form.value);
    console.log(param, this.documentData);

    if (!form.valid) return;
    if (!_.isEmpty(this.documentData)) {
      this.adminService
        .updateDocumentTemplate(param, this.documentData.id)
        .then((response) => {
          if (response.result.success) {
            this.noDataFound = false;
            this.submmitDcoumentcontent = false;
            form.markAsPristine();
            this.addDocument = false;
            if (param.id)
              toast = { msg: response.result.message, status: "success" };
            else toast = { msg: response.result.message, status: "success" };
            this.selectedDocument = response.result.data;
            this.trigger.emit({
              flag:
                // param.id
                this.selectedDocument.id,
              data: this.selectedDocument,
            });
          } else {
            toast = { msg: response.result.message, status: "error" };
          }
          this.snackbar.showSnackBar(toast);
        });
    } else {
      this.adminService.saveDocumentTemplate(param).then((response) => {
        if (response.result.success) {
          this.noDataFound = false;
          this.submmitDcoumentcontent = false;
          this.addDocument = false;
          form.markAsPristine();
          if (param.id)
            toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          this.selectedDocument = response.result.data;
          this.trigger.emit({ flag: param.id, data: this.selectedDocument });
        } else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      });
    }
  }
  selectTemplate(templateType) {
    let template = this.copyFormArray.find((item) => item.id === templateType);
    this.documentTemplate.patchValue({
      document_body: template.document_body,
    });
  }
  onCheckboxChange(event: any): void {
    if (!event.checked) {
      this.selectedModule = null;
      this.documentTemplate.get("form_id").clearValidators(); // Reset selection when checkbox is unchecked
    } else {
      this.getFormModules();
      this.documentTemplate.get("form_id").setValidators([Validators.required]);
      this.documentTemplate.get("form_id").updateValueAndValidity();
    }
  }

  changeModule(selectedModuleId: string): void {
    // console.log("Selected Module ID:", selectedModuleId);
    // Additional logic for handling module selection
  }
  getFormModules() {
    this.adminService
      .getModules({ type: "documents" })
      .then((response) => {
        if (response.result.success) {
          this.modulesList = response.result.data.modulesDt;
          this.moduleSelect = this.modulesList[0].id;
        }
      })
      .catch((error) => console.log(error));
  }
}
