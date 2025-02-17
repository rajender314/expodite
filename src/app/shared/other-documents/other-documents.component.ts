import { Component, Input, OnInit } from "@angular/core";
import { Images } from "../../images/images.module";
import { FileUploader } from "ng2-file-upload";
import { ImportDocumentComponent } from "../../dialogs/import-document/import.component";
import { MatDialog } from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { UtilsService } from "../../services/utils.service";
import { SnakbarService } from "../../services/snakbar.service";
declare var App: any;

@Component({
  selector: "app-other-documents",
  templateUrl: "./other-documents.component.html",
  styleUrls: ["./other-documents.component.scss"],
})
export class OtherDocumentsComponent implements OnInit {
  @Input() order: any;
  @Input() isEditPermission = true;
  public images = Images;
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

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private snackbar: SnakbarService,

  ) {
    this.activatedRoute.params.subscribe(
      (param) => (this.shipmentId = param.shipmentId)
    );
  }

  ngOnInit(): void {}
  public moduleName = ""
  formEmitEvent(obj) {
    this.moduleName = obj.module;
    this.estimate_form_id = obj.estimate_form_id;
    this.freightandlogistics = obj.form;
    if(this.isEditPermission) {
      this.freightandlogistics.enable();
    } else if(!this.isEditPermission) {
      this.freightandlogistics.disable();
    }
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
      organization_id: this.shipmentId,
      moduleName: this.moduleName
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
