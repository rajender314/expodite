import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { language } from "../../language/language.module";
import { Images } from "../../images/images.module";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-order-documents",
  templateUrl: "./order-documents.component.html",
  styleUrls: ["./order-documents.component.scss"],
})
export class OrderDocumentsComponent implements OnInit {
  @Input() orderDocMap;
  @Input() typeId;
  @Input() removeDocHighlight;
  @Input() docName: any = "";
  // @Output() documentEvent = new EventEmitter<string>();
  @Output() documentEventId = new EventEmitter<string>();
  public language = language;
  public images = Images;
  public orderDocuments: any;
  public orderPreDocuments: any;
  public orderPostDocuments: any;
  public templates;
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // this.getOrderDocuments();
    // this.adminService
    //   .getDocumentTemplateTypes()
    //   .then((response) => {
    //     if (response.result.success) this.templates = response.result.data;
    //   })
    //   .catch((error) => console.log(error));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.removeDocHighlight) {
      this.docName = "";
    }
  }
  getTempTypeName(tyepId) {
    // if (this.templates) {
    //   return this.templates.find((template) => template.id === tyepId).name;
    // }
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.receivedDocument("");
  // }
  // getOrderDocuments(): void {
  //   this.ordersService
  //     .getOrderDocumentApi(this.orderId)
  //     .then((response) => {
  //       this.orderDocuments = response.result.data.filter(
  //         (item) => item.type === "invoices"
  //       );
  //       this.orderPreDocuments = response.result.data.filter(
  //         (item) => item.type === "pre_shipping"
  //       );
  //       this.orderPostDocuments = response.result.data.filter(
  //         (item) => item.type === "post_shipping"
  //       );
  //       this.documentEvent.emit(response.result.data);
  //       // const preItems = this.orderDocuments.filter((item) => item.type === "pre");

  //       console.log(response, "copy form");
  //     })
  //     .catch((error) => console.log(error));
  // }
  // public docName = "";
  moveSelectedDocument(document, docName) {
    this.documentEventId.emit(document);
    setTimeout(() => {
      this.docName = document;
    }, 1000);
  }
}
