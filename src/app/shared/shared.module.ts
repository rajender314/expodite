import { PipesModule } from "./../pipes-module/pipes.module";
import { ContactImageNamePipe } from "./../custom-pipes/contact-image-name.pipe";
import { LetterPipe } from "./../custom-pipes/letter.pipe";
import { MyFilterPipe } from "./../general-module/reports/reports-dashboard/reports-dashboard.component";
import { EpiCurrencyPipe } from "./../invoice-module/invoice-details/invoice-details.component";
import { AddLineItemComponent } from "./../dialogs/add-line-item/add-line-item.component";
import { DeleteLineItemComponent } from "./../dialogs/delete-line-item/delete-line-item.component";
import { CustomMaterialModule } from "./../custom-material/custom-material.module";
import { MoreEmailsComponent } from "./../dialogs/more-emails/more-emails.component";
import { FileUploadModule } from "ng2-file-upload";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
// import { EpiCurrencyPipe } from './../pipes/epi-currency.pipe';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PowerConversionPipe } from "../pipes/power-conversion.pipe";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ReactiveFormsModule } from "@angular/forms";
import { PaginationComponent } from "../pagination/pagination.component";
import { QuillModule } from "ngx-quill";
import "quill-mention";
import "quill-emoji";
import { FormBuilderComponent } from "./form-builder/form-builder.component";
import { AddProductsComponent } from "./add-products/add-products.component";
import { SelectAddressComponent } from "./select-address/select-address.component";
import { FreightDynamicFormComponent } from "./freight-dynamic-form/freight-dynamic-form.component";
import { OtherCostsTransportChargesComponent } from "./other-costs-transport-charges/other-costs-transport-charges.component";
import { ShippingContainersComponent } from "./shipping-containers/shipping-containers.component";
import { UploadShippingDocsComponent } from "./upload-shipping-docs/upload-shipping-docs.component";
import { EditDesciptionModelComponent } from "./edit-desciption-model/edit-desciption-model.component";
import { ProductsFormComponent } from "./products-form/products-form.component";
import { UploadLogoComponent } from "./upload-logo/upload-logo.component";
import { SubTotalFormComponent } from "./sub-total-form/sub-total-form.component";
import { ProductDetailCellComponent } from "./components/product-detail-cell/product-detail-cell.component";
import { AgCustomHeaderComponent } from "./components/ag-custom-header/ag-custom-header/ag-custom-header.component";
import { AgGridEditComponent } from "./components/ag-grid-edit/ag-grid-edit.component";
import { EditiconCellComponent } from "./components/editicon-cell/editicon-cell.component";
import { AgGridViewComponent } from "./ag-grid-view/ag-grid-view.component";
import { AgGridModule } from "ag-grid-angular";
import { AgProductEditComponent } from "./components/ag-product-edit/ag-product-edit.component";
import { ConfirmDeleteComponent } from "./components/confirm-delete/confirm-delete.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import { EstimatePaymentsComponent } from "../estimates-module/estimate-payments/estimate-payments.component";
import { EstimateSpecificationComponent } from "../estimates-module/estimate-specification/estimate-specification.component";
import { CreatePackageComponent } from "../orders-module/shipment-packing-details/create-package/create-package.component";
import { OrderDocumentsComponent } from "../orders-module/order-documents/order-documents.component";
import { DoccuComponent } from "../orders-module/orderdynamic-documents/document.component";
import { PackageProductsFormComponent } from "./package-products-form/package-products-form.component";
import { DocumentEditFormsComponent } from "./components/document-edit-forms/document-edit-forms.component";
import { OtherDocumentsComponent } from "./other-documents/other-documents.component";
import { PackageFormBuilderComponent } from "./package-form-builder/package-form-builder.component";
import { FormBuilderListViewComponent } from "./form-builder-list-view/form-builder-list-view.component";
import { ViewListComponent } from "./form-builder-list-view/view-list/view-list.component";
import { ViewDetailsComponent } from "./form-builder-list-view/view-details/view-details.component";

@NgModule({
  declarations: [
    EstimateSpecificationComponent,
    OrderDocumentsComponent,
    DoccuComponent,
    EstimatePaymentsComponent,
    AddLineItemComponent,
    DeleteLineItemComponent,
    PaginationComponent,
    EpiCurrencyPipe,
    MyFilterPipe,
    LetterPipe,
    PowerConversionPipe,
    LetterPipe,
    ContactImageNamePipe,
    FormBuilderComponent,
    AddProductsComponent,
    SelectAddressComponent,
    FreightDynamicFormComponent,
    OtherCostsTransportChargesComponent,
    ShippingContainersComponent,
    UploadShippingDocsComponent,
    EditDesciptionModelComponent,
    ProductsFormComponent,
    UploadLogoComponent,
    SubTotalFormComponent,
    ProductDetailCellComponent,
    AgCustomHeaderComponent,
    AgGridEditComponent,
    EditiconCellComponent,
    AgGridViewComponent,
    AgProductEditComponent,
    ConfirmDeleteComponent,
    CreatePackageComponent,
    PackageProductsFormComponent,
    DocumentEditFormsComponent,
    OtherDocumentsComponent,
    PackageFormBuilderComponent,
    FormBuilderListViewComponent,
    ViewListComponent,
    ViewDetailsComponent,
  ],
  imports: [
    EditorModule,
    CommonModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule,

    CustomMaterialModule,

    FlexLayoutModule,

    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    InfiniteScrollModule,
    PerfectScrollbarModule,
    FileUploadModule,
    NgSelectModule,
    FormsModule,
    QuillModule.forRoot({
      modules: {
        //toolbar: '.toolbar',
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            // ["code-block"],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            // [{ script: "sub" }, { script: "super" }], // superscript/subscript
            // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            // [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ font: [] }],
            // [{ align: [] }],

            ["clean"], // remove formatting button

            // ["link"],
            // ["link", "image", "video"],
          ],
        },

        mention: {
          allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
          mentionDenotationChars: ["@", "#"],
          source: (searchTerm, renderList, mentionChar) => {
            let values;

            if (mentionChar === "@") {
              values = [
                { id: 3, value: "Fredrik Sundqvist 2" },
                { id: 4, value: "Patrik Sjölin 2" },
              ];
            } else {
              values = [
                {
                  id: 1,
                  value: "Fredrik Sundqvist",
                  link: "https://google.com",
                },
                { id: 2, value: "Patrik Sjölin" },
              ];
            }

            if (searchTerm.length === 0) {
              renderList(values, searchTerm);
            } else {
              const matches = [];
              for (var i = 0; i < values.length; i++)
                if (
                  ~values[i].value
                    .toLowerCase()
                    .indexOf(searchTerm.toLowerCase())
                )
                  matches.push(values[i]);
              renderList(matches, searchTerm);
            }
          },
        },
        "emoji-toolbar": true,
        "emoji-textarea": true,
        "emoji-shortname": true,
        keyboard: {
          bindings: {
            // shiftEnter: {
            //   key: 13,
            //   shiftKey: true,
            //   handler: (range, context) => {
            //     // Handle shift+enter
            //     console.log("shift+enter")
            //   }
            // },
            enter: {
              key: 13,
              handler: (range, context) => {
                console.log(range, context, 7863);
                return true;
              },
            },
          },
        },
      },
    }),
    // ExportDialogComponent,
    // MoreEmailsComponent
    AgGridModule.withComponents([]),
  ],
  providers: [
    AddLineItemComponent,
    DeleteLineItemComponent,
    // EpiCurrencyPipe,
    // MyFilterPipe,
    // LetterPipe,
    // DatePipe,
    // PowerConversionPipe, LetterPipe, ContactImageNamePipe,
  ],
  exports: [
    EstimateSpecificationComponent,
    EstimatePaymentsComponent,
    EditorModule,
    AddLineItemComponent,
    DeleteLineItemComponent,
    PaginationComponent,
    EpiCurrencyPipe,
    MyFilterPipe,
    LetterPipe,
    PowerConversionPipe,
    LetterPipe,
    ContactImageNamePipe,
    OrderDocumentsComponent,
    DoccuComponent,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule,
    CustomMaterialModule,
    FlexLayoutModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    InfiniteScrollModule,
    PerfectScrollbarModule,
    FileUploadModule,
    NgSelectModule,
    QuillModule,
    FormBuilderComponent,
    FormBuilderListViewComponent,
    ViewListComponent,
    ViewDetailsComponent,
    // AddProductsComponent,
    SelectAddressComponent,
    // UploadLogoComponent,
    SubTotalFormComponent,
    ProductsFormComponent,
    AgGridViewComponent,
    PackageProductsFormComponent,
    OtherDocumentsComponent,
    // AgProductEditComponent,
    // FreightDynamicFormComponent,
  ],
  entryComponents: [
    // ExportDialogComponent,
    // MoreEmailsComponent
    // FormBuilderComponent,
    // ProductsFormComponent,
    // SelectAddressComponent,
    // SubTotalFormComponent,
  ],
})
export class SharedModule {}
