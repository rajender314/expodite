import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { OrdersService } from "../../services/orders.service";
import { Images } from "../../images/images.module";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDialog } from "@angular/material/dialog";
import { DocumentEditFormsComponent } from "../../shared/components/document-edit-forms/document-edit-forms.component";
import { ActivatedRoute } from "@angular/router";
import { UtilsService } from "../../services/utils.service";
import { FileUploader } from "ng2-file-upload";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-dynamic-documents",
  templateUrl: "./document.component.html",
  styleUrls: ["./document.component.scss"],
})
export class DoccuComponent implements OnInit {
  @Input() item;
  @Input() orderId;
  @Input() type;
  @Output() getOrderDocuments = new EventEmitter();
  @Input() isEditPermission = true;
  public images = Images;
  showDiv: boolean = true;
  @ViewChild("containerRef") containerRef!: ElementRef;

  toggleDiv() {
    this.showDiv = !this.showDiv;
  }
  public orginalItem;
  public some = 0;
  public id;
  constructor(
    private sanitizer: DomSanitizer,
    private orderService: OrdersService,
    private el: ElementRef,
    private renderer: Renderer2,
    private snackbar: SnakbarService,
    private activatedRoute: ActivatedRoute,

    public dialog: MatDialog,
    private utilsService: UtilsService
  ) {
    this.activatedRoute.params.subscribe((param) => {
      if (param.shipmentId) {
        this.id = param.shipmentId;
      } else this.id = param.id;
    });
  }
  // editExist = false;
  ngOnInit(): void {
    this.orginalItem = { ...this.item };
    this.item.document_body = this.sanitizeHtml(this.orginalItem.document_body);
    // this.item.document_body = this.sanitizeHtml(
    //   this.disableInputsInHtml(this.orginalItem.document_body).replace(
    //     /##/g,
    //     ""
    //   )
    // );
    let content = this.orginalItem.document_body;
    // Find text between ## ##
    const regex = /##(.*?)##/g;
    // if (this.orginalItem.document_body) {
    // this.editExist = this.orginalItem.document_body.match(regex)?.length
    //   ? true
    //   : false;
    this.applyStyles();
    // }
  }

  disableInputsInHtml(html: string): string {
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = html;

    const inputs = tempContainer.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        if (this.editMode) {
          input.disabled = false;
        } else {
          input.disabled = true;
        }
      }
    });

    return tempContainer.innerHTML;
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  public editMode = false;

  private editDialogOpen(module, title) {
    let dialogRef = this.dialog.open(DocumentEditFormsComponent, {
      panelClass: "alert-dialog",
      width: "70%",
      data: {
        // rowData: event.node.data,
        title: title,
        saveApi: "App.base_url + pdatePFIProduct",
        tableName: module,
        related_to_id: this.id,
      },
      disableClose: true,
    });
    return dialogRef;
  }

  onEdit(document) {
    let dialogRef;

    dialogRef = this.editDialogOpen(document.type, "Edit Document");
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.getOrderDocuments.emit();
      }
    });
  }

  // onEdit() {
  //   if (this.editMode) {
  //     this.editMode = false;

  //     this.item.document_body = this.sanitizeHtml(
  //       this.disableInputsInHtml(this.orginalItem.document_body).replace(
  //         /##/g,
  //         ""
  //       )
  //     );
  //     this.applyStyles();
  //   } else {
  //     this.editMode = true;

  //     let content = this.orginalItem.document_body;
  //     // Find text between ## ##
  //     const regex = /##(.*?)##/g;
  //     const matches = content.match(regex);
  //     if (matches) {
  //       matches.forEach((match) => {
  //         const value = match.replace(/##/g, ""); // Remove ##

  //         const inputField = `<input type="text" style=" border: 1px solid #ccc;
  //               padding: 5px;
  //               margin: 5px;
  //               font-size: 14px;
  //               height:50px;
  //               width:150px;
  //               border-radius: 3px;
  //           ";
  //               class="editable-input" value="${value}"/>`;
  //         content = content.replace(match, inputField);
  //       });
  //       // Update the content of the div
  //       this.item.document_body = this.sanitizeHtml(content);
  //       this.applyStyles();
  //     }

  //     this.item.document_body = this.sanitizeHtml(
  //       this.disableInputsInHtml(content)
  //     );
  //     this.applyStyles();
  //   }
  // }

  onSave() {
    let content = document.getElementById(`${this.orginalItem.id}`);
    const inputs = content.querySelectorAll("input");
    inputs.forEach((input: any) => {
      if (input.type == "checkbox") {
        const newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.checked = input.checked;

        if (input.checked) {
          newCheckbox.setAttribute("checked", "true");
        } else {
          newCheckbox.removeAttribute("checked");
        }

        input.parentNode.replaceChild(newCheckbox, input);
      } else if (input.type === "radio") {
        const newRadio = document.createElement("input");
        newRadio.type = "radio";
        newRadio.name = input.name;
        newRadio.checked = input.checked;

        if (input.checked) {
          newRadio.setAttribute("checked", "true");
        } else {
          newRadio.removeAttribute("checked");
        }
        input.parentNode.replaceChild(newRadio, input);
      } else if (input.type === "text") {
        const value = input.value;
        const span = document.createElement("span");
        span.innerHTML = `##${value}##`;
        input.parentNode.replaceChild(span, input);
      }
    });
    let innerHTML = content.innerHTML;

    this.item.document_body = this.sanitizeHtml(
      this.disableInputsInHtml(content.innerHTML).replace(/##/g, "")
    );
    this.orderService
      .saveOrderDocumentApi({
        document_id: this.item.id,
        document_body: innerHTML,
      })
      .then((response) => {
        this.editMode = false;
        this.orginalItem.document_body = innerHTML;
        this.item.document_body = this.sanitizeHtml(
          this.disableInputsInHtml(innerHTML).replace(/##/g, "")
        );
        let toast: object;
        toast = {
          msg: `${this.item.name} Updated Successfully`,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      });
    this.applyStyles();
  }

  ngAfterViewChecked(): void {
    if (this.containerRef) this.applyStyles();
  }

  applyStyles() {
    const tables = this.containerRef?.nativeElement.querySelectorAll("table");
    if (tables) {
      tables.forEach((table: HTMLElement) => {
        // this.renderer.setStyle(table, "border", "1px solid #ccc");
        this.renderer.setStyle(table, "width", "100%");
        this.renderer.setStyle(table, "border-collapse", "collapse");

        const cells = table.querySelectorAll("th, td");
        cells.forEach((cell: HTMLElement) => {
          // this.renderer.setStyle(cell, "border", "1px solid #ccc");
          this.renderer.setStyle(cell, "padding", "0.4rem");
          // this.renderer.setStyle(cell, "text-align", "left");
        });
      });
    }
    const strongTags =
      this.containerRef?.nativeElement.querySelectorAll("strong");

    strongTags &&
      strongTags.forEach((strong: HTMLElement) => {
        this.renderer.setStyle(strong, "font-weight", "bold");
      });
  }

  // Document Upload Code

  public shippingAttachments = [];
  public uploader: FileUploader = new FileUploader({
    url: "",
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  public saveBtnClicked = false;
  public freightandlogistics: FormGroup;
  public estimate_form_id = "";
  public editID = "";
  public shipmentId = "";
  public moduleName = "";
  formEmitEvent(obj) {
    this.moduleName = obj.module;
    this.estimate_form_id = obj.estimate_form_id;
    this.freightandlogistics = obj.form;
    if (obj.editID) this.editID = obj.editID;
  }
  public uploads = [];
  public activeState = false;
  emitUploadInfo(ev) {
    this.moduleName = ev.module;
    this.activeState = true;
    this.uploads = ev.uploadList;
    this.freightandlogistics = ev.form;
    if (this.uploads.length) {
      this.freightandlogistics.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue(this.uploads);
    } else {
      this.freightandlogistics.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue([]);
    }
  }

  saveStoreAttributeApi() {
    let toast: object;
    this.activeState = false;
    let param = {
      form_data: this.freightandlogistics.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.id,
      moduleName: this.moduleName,
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      this.activeState = false;
      if (res.success) {
        if (!this.editID) this.editID = res.data?.new_data?.id;
        this.freightandlogistics.markAsPristine();
        toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        this.saveBtnClicked = false;
      } else {
        // this.disabledSave = false;
        toast = {
          msg: res.message ? res.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
        this.saveBtnClicked = false;
      }
    });
  }
  public undoOnCancel = false;
  cancelFreight() {
    this.activeState = false;
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
  }
}
