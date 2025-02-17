import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RouterModule, CanActivate, Router } from "@angular/router";
import { promise } from "protractor";
import * as _ from "lodash";
import { BehaviorSubject } from "rxjs";

declare var App: any;

@Injectable({
  providedIn: "root",
})
export class OrdersService implements CanActivate {
  orderRedirect = false;
  public routeAllowed = false;
  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    let i = _.findIndex(<any>App.env_configurations.env_config, {
      name: "Orders",
    });
    // console.log(i)
    if (i > -1 && App.env_configurations.env_config[i].display == "yes") {
      this.routeAllowed = true;
    } else {
      this.routeAllowed = false;
    }
    // console.log(this.routeAllowed)
    // console.log((ActivatedRouteSnapshot))
    // console.log(App.user_roles_permissions.filter(function(value){return (value.code=='orders' && value.selected);}).length)
    if (
      ActivatedRouteSnapshot.routeConfig.path == "orders" &&
      App.user_roles_permissions.filter(function (value) {
        return value.code == "orders" && value.selected;
      }).length &&
      this.routeAllowed
    ) {
      // this.orderRedirect = true;
      return true;
    } else {
      // console.log(1111111)
      this.router.navigate(["access-denied"]);
      // this.orderRedirect = false;
      return false;
    }
  }

  private ordersListApi = App.base_url + "getListOrders";
  private estimatesListApi = App.base_url + "getListEstimates";
  private shipperAddr = App.base_url + "getCompanyShpAddr";
  private createOrdertApi = App.base_url + "addOrders";
  private createEstimateApi = App.base_url + "addEstimates";
  private changeOrderPrice = App.base_url + "updateProductPrice";
  private updateEstimateProductPrice =
    App.base_url + "updateEstimateProductPrice";
  private invoiceListApi = App.base_url + "getOrdersInv";
  private overviewList = App.base_url + "getListOverview";
  private acceptOrdertApi = App.base_url + "updateOrdersId";
  private packagingDetailsApi = App.base_url + "getOrdersPackage";
  private icttDataApi = App.base_url + "getIcttData";
  private ActivityDetailsApi = App.base_url + "getOrdersActivity";
  // private ActivityEstimateDetailsApi = App.base_url + "getEstimatesActivity";
  private ActivityEstimateDetailsApi = App.base_url + "getActivityLogs";

  private addBatchNumberApi = App.base_url + "AddOrdersPackage";
  private generateInvoiceApi = App.base_url + "generateInvoice";
  private generateProfInvApi = App.base_url + "generateProfInv";
  private generateTaxInvoiceApi = App.base_url + "generateTaxInv";
  private generateIGSTInvoiceApi = App.base_url + "generateIGST";

  private getOrdersInvApi = App.base_url + "getOrdersInv";
  private getProfInvApi = App.base_url + "getProfInv";
  private addOrdersSdfApi = App.base_url + "addOrdersSdf";
  private addOrdersExpApi = App.base_url + "addOrderExp";
  private getOrdersSdfApi = App.base_url + "getOrdersSdf";
  private getOrdersExpApi = App.base_url + "getOrderExp";
  private addOrdersConcernApi = App.base_url + "addOrdersConcern";
  private getOrdersConernApi = App.base_url + "getOrdersConcern";
  private getListOrdersAttApi = App.base_url + "getListOrdersAtt";
  private deleteAttachmentApi = App.base_url + "deleteOrdersAtt";

  private getShippingDetailsApi = App.base_url + "getShippingTrack";
  private getCheckOrdersPdfApi = App.base_url + "checkOrdersPdf";
  private addInvoiceShippingApi = App.base_url + "addInvoiceShipping";
  private OrderCoaDataApi = App.base_url + "getOrdBtchCoa";
  // private exportPdfApi = App.base_url + 'zipOrdersPdf';
  private exportPdfApi = App.base_url + "downloadALlOtherDocs";
  private invoiceStatusApi = App.base_url + "updateInvoiceStatus";
  private editOrderDetailsApi = App.base_url + "editOrderDetails";
  private getPackageDetailsApi = App.base_url + "getPackageDetails";
  private saveDrumApi = App.base_url + "saveDrum";
  private sendDocumentsMailApi = App.base_url + "sendDocumentsMail";
  private addFileAttachmentsApi = App.base_url + "getFiles";
  private deleteFileApi = App.base_url + "deleteFiles";
  private getClientsEmailListApi = App.base_url + "getClientsEmailList";
  private clientDocPermissionsApi = App.base_url + "clientDocPermissions";
  private getDeliverDetailsApi = App.base_url + "getDeliverDetails";
  private deleteFilesApi = App.base_url + "deleteDeliveryFiles";
  private saveIcttApi = App.base_url + "saveIctt";
  private getPaymentTypesApi = App.base_url + "getPaymentTypes";

  private getOrdersFilterApi = App.base_url + "getFilters";
  private getInvoiceFilterApi = App.base_url + "getInvoiceFilters";
  private updateOrdersPackageApi = App.base_url + "updateOrdersPackage";
  private getUom = App.base_url + "getUom";
  private getPrimaryPackingDetails = App.base_url + "getPrimaryPackingDetails";
  private getTaxInvApi = App.base_url + "getTaxInv";
  private getIgstnvApi = App.base_url + "getIGSTInvoice";

  private addOrdProfInvPackageApi = App.base_url + "addOrdProfInvPackage";
  private addOrdAllPackagesApi = App.base_url + "addOrdAllPackages";

  private mergeOrderApi = App.base_url + "mergeOrders";
  private editdescription = App.base_url + "editDescription";
  private splitEstimateqty = App.base_url + "splitEstimates";
  private bankdetailsapi = App.base_url + "getBankDt";
  private saveuploadfiles = App.base_url + "saveFiles";
  private saveFreightform = App.base_url + "saveFreight";
  private getFreightform = App.base_url + "getFreight";
  private saveOtherCostsApi = App.base_url + "saveOtherCosts";
  private getOtherCostsApi = App.base_url + "getOtherCosts";
  private editFreightApi = App.base_url + "editFreight";
  private editInsuranceApi = App.base_url + "editInsurance";

  private saveOrdersContainersApi = App.base_url + "saveOrdersContainers";
  private getExportRegisterApi = App.base_url + "getOrderExportRegister";
  private saveExportregisterApi = App.base_url + "saveOrdergetExportRegister";
  private saveTaxInvoiceApi = App.base_url + "saveCustomsTaxInv";
  // private updateEstimateapi = App.base_url + "updateEstimateStatus ";
  private updateEstimateapi = App.base_url + "updatePFIStatus";
  private generateCustomsInvoiceApi = App.base_url + "generateCustomsInvoice";
  private postAcceptQuotation = App.base_url + "acceptQuotation";

  private updateEstimatealineitem = App.base_url + "updateEstimateDetails ";
  private saveOtherOrderDetailsApi = App.base_url + "saveOtherOrderDetails ";
  private getOtherOrderDetailsApi = App.base_url + "getOtherOrderDetails ";
  // private saveTaxConversionApi = App.base_url + "saveTaxConversion";
  private saveTaxConversionApi = App.base_url + "taxCurrencyConversion";
  private getproductsPack = App.base_url + "getOrdersProducts ";
  private addPackage = App.base_url + "addProductPackage ";
  private getProductPackage = App.base_url + "getProductPackage";
  private saveAdcshett = App.base_url + "saveAdcSheetInfo";
  private getAdcsheet = App.base_url + "getAdcSheetInfo";
  // private saveOrderDocumentSIDraft = App.base_url + 'saveOrderDocumentSIDraft';
  private saveOrderDocumentSIDraft = App.base_url + "saveOrderDocumentSInLine";
  //private getOrderDocumentSIDraft = App.base_url + 'getOrderDocumentSIDraft';
  private getOrderDocumentSIDraft = App.base_url + "getOrderDocumentSInLine";
  private procuctBatches = App.base_url + "productBatches";
  private createPO = App.base_url + "savePurchaseOrder";
  private getPoList = App.base_url + "getPurchaseOrders";
  private getPoActivity = App.base_url + "getPOActivity";
  private getPo = App.base_url + "getPO";
  private updatePOStatus = App.base_url + "updatePOStatus";
  private updatePOInsurance = App.base_url + "updatePOInsurance";
  private updatePOFreight = App.base_url + "updatePOfreight";
  private updatePOProductPrice = App.base_url + "updatePOProductPrice";
  private updatePODiscount = App.base_url + "updatePODiscount";
  private updatePODescription = App.base_url + "updatePODescription";
  private savePOAttachments = App.base_url + "savePOAttachments";
  private getPOAttachments = App.base_url + "getPOAttachments";
  private deletePOAttachments = App.base_url + "deletePOFiles";
  private getActivityLog = App.base_url + "getActionHistory";
  private getPOFilters = App.base_url + "getPOFilters";
  private sendPOEmail = App.base_url + "sendPOEmail";
  private addCommercialInvoice = App.base_url + "addCommercialInvoice";
  private getPayments = App.base_url + "getPayments";
  private addPayments = App.base_url + "addPayments";
  private getPaymentStatus = App.base_url + "getPaymentStatuses";
  private getCommercialInvoiceList = App.base_url + "getCommercialInvoices";
  private addCompositeInvoice = App.base_url + "addCompositeInvoice";
  private importProductsList = App.base_url + "importProductsList";
  private getTaxTypes = App.base_url + "getTaxTypes";
  private uploadApi = App.base_url + "uploadOrgImage";
  private viewDetails = App.base_url + "getViewDetails";
  private orderPermissions = App.base_url + "orderPermissions";
  private editInLineApi = App.base_url + "editInLine";
  private saveOrderDocument = App.base_url + "orderDocumentTemplate";
  private getOrderDocument = App.base_url + "orderDocumentTemplates";
  private getorderShipments = App.base_url + "orderShipments";
  private generateCommercialInvoiceApi = App.base_url + "generateCommercialInv";
  private postDeleteFromData = App.base_url + "deleteFromData";
  private postCreatePackage = App.base_url + "createPackage";
  private postUpdatePackage = App.base_url + "updatePackage";
  private postCreateShipmentFromOrder =
    App.base_url + "createShipmentFromOrder";

  private postCreateContainer = App.base_url + "createContainer";
  private getPackagesApi = App.base_url + "getPackages";
  private postQuotationOrders = App.base_url + "quotationOrders";

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }
  constructor(private http: HttpClient, public router: Router) {}

  private activeSection = new BehaviorSubject<string>("");
  activeSection$ = this.activeSection.asObservable();

  setActiveSection(sectionId: string) {
    this.activeSection.next(sectionId);
  }

  getProcuctBatches(param: any): Promise<any> {
    return this.http
      .get(`${this.procuctBatches}/${param}`)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getInvoiceList(param: any): Promise<any> {
    return this.http
      .post(this.invoiceListApi, param)
      .toPromise()
      .then((response) => response);
  }
  saveProformaBatchNumber(param: any): Promise<any> {
    return this.http
      .post(this.addOrdProfInvPackageApi, param)
      .toPromise()
      .then((response) => response);
  }
  addOrdAllPackages(param: any): Promise<any> {
    return this.http
      .post(this.addOrdAllPackagesApi, param)
      .toPromise()
      .then((response) => response);
  }

  getUomData(param: any): Promise<any> {
    return this.http
      .post(this.getUom, param)
      .toPromise()
      .then((response) => response);
  }
  getPaymentTypes(): Promise<any> {
    return this.http
      .post(this.getPaymentTypesApi, {})
      .toPromise()
      .then((response) => response);
  }
  getPrimaryPackageData(param: any): Promise<any> {
    return this.http
      .post(this.getPrimaryPackingDetails, param)
      .toPromise()
      .then((response) => response);
  }

  getTaxInv(param: any): Promise<any> {
    return this.http
      .post(this.getTaxInvApi, param)
      .toPromise()
      .then((response) => response);
  }
  getIgstInv(param: any): Promise<any> {
    return this.http
      .post(this.getIgstnvApi, param)
      .toPromise()
      .then((response) => response);
  }
  changePoNumbr(param: any): Promise<any> {
    return this.http
      .post(this.editOrderDetailsApi, param)
      .toPromise()
      .then((response) => response);
  }

  getOrdersList(param: any): Promise<any> {
    return this.http
      .post(this.ordersListApi, param)
      .toPromise()
      .then((response) => response);
  }

  getEstimatesList(param: any): Promise<any> {
    return this.http
      .post(this.estimatesListApi, param)
      .toPromise()
      .then((response) => response);
  }
  getShipperAddress(param: any): Promise<any> {
    return this.http
      .post(this.shipperAddr, param)
      .toPromise()
      .then((response) => response);
  }

  exportOrdersPdf(param: any): Promise<any> {
    return this.http
      .post(this.exportPdfApi, param)
      .toPromise()
      .then((response) => response);
  }
  getOverviewList(param: any): Promise<any> {
    return this.http
      .post(this.overviewList, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  createOrder(param: any): Promise<any> {
    return this.http
      .post(this.createOrdertApi, param)
      .toPromise()
      .then((response) => response);
  }
  createEstimate(param: any): Promise<any> {
    return this.http
      .post(this.createEstimateApi, param)
      .toPromise()
      .then((response) => response);
  }
  updateOrdersPackage(param: any): Promise<any> {
    return this.http
      .post(this.updateOrdersPackageApi, param)
      .toPromise()
      .then((response) => response);
  }
  addOrdersSdf(param: any): Promise<any> {
    return this.http
      .post(this.addOrdersSdfApi, param)
      .toPromise()
      .then((response) => response);
  }
  addOrdersExp(param: any): Promise<any> {
    return this.http
      .post(this.addOrdersExpApi, param)
      .toPromise()
      .then((response) => response);
  }
  addOrdersConcern(param: any): Promise<any> {
    return this.http
      .post(this.addOrdersConcernApi, param)
      .toPromise()
      .then((response) => response);
  }
  getOrdersConcern(param: any): Promise<any> {
    return this.http
      .post(this.getOrdersConernApi, param)
      .toPromise()
      .then((response) => response);
  }
  getOrdersSdf(param: any): Promise<any> {
    return this.http
      .post(this.getOrdersSdfApi, param)
      .toPromise()
      .then((response) => response);
  }
  getOrderFilterData(param: any): Promise<any> {
    return this.http
      .post(this.getOrdersFilterApi, param)
      .toPromise()
      .then((response) => response);
  }
  getInvoiceFilterList(param: any): Promise<any> {
    return this.http
      .post(this.getInvoiceFilterApi, param)
      .toPromise()
      .then((response) => response);
  }
  getOrdersExport(param: any): Promise<any> {
    return this.http
      .post(this.getOrdersExpApi, param)
      .toPromise()
      .then((response) => response);
  }
  changePrice(param: any): Promise<any> {
    return this.http
      .post(this.changeOrderPrice, param)
      .toPromise()
      .then((response) => response);
  }

  changeEstimatePrice(param: any): Promise<any> {
    return this.http
      .post(this.updateEstimateProductPrice, param)
      .toPromise()
      .then((response) => response);
  }
  acceptOrder(param: any): Promise<any> {
    return this.http
      .post(this.acceptOrdertApi, param)
      .toPromise()
      .then((response) => response);
  }
  getPackagingOrderDetails(param: any): Promise<any> {
    return this.http
      .post(this.packagingDetailsApi, param)
      .toPromise()
      .then((response) => response);
  }

  getIcttData(param: any): Promise<any> {
    return this.http
      .post(this.icttDataApi, param)
      .toPromise()
      .then((response) => response);
  }

  getActivtyDetails(param: any): Promise<any> {
    return this.http
      .post(this.ActivityDetailsApi, param)
      .toPromise()
      .then((response) => response);
  }
  getEstimateActivtyDetails(param: any): Promise<any> {
    return (
      this.http
        // .post(this.ActivityEstimateDetailsApi, param)
        .get(`${this.ActivityEstimateDetailsApi}?id=${param.id}`)

        .toPromise()
        .then((response) => response)
    );
  }
  saveBatchNumber(param: any): Promise<any> {
    return this.http
      .post(this.addBatchNumberApi, param)
      .toPromise()
      .then((response) => response);
  }
  generateInvoice(param: any): Promise<any> {
    return this.http
      .post(this.generateInvoiceApi, param)
      .toPromise()
      .then((response) => response);
  }
  generateProfInv(param: any): Promise<any> {
    return this.http
      .post(this.generateProfInvApi, param)
      .toPromise()
      .then((response) => response);
  }
  generateTaxInvoice(param: any): Promise<any> {
    return this.http
      .post(this.generateTaxInvoiceApi, param)
      .toPromise()
      .then((response) => response);
  }
  generateIgstInvoice(param: any): Promise<any> {
    return this.http
      .post(this.generateIGSTInvoiceApi, param)
      .toPromise()
      .then((response) => response);
  }
  getInvoiceData(param: any): Promise<any> {
    return this.http
      .post(this.getOrdersInvApi, param)
      .toPromise()
      .then((response) => response);
  }
  getProfInv(param: any): Promise<any> {
    return this.http
      .post(this.getProfInvApi, param)
      .toPromise()
      .then((response) => response);
  }

  getAttachmentsList(param: any): Promise<any> {
    return this.http
      .post(this.getListOrdersAttApi, param)
      .toPromise()
      .then((response) => response);
  }
  deleteAttachment(param: any): Promise<any> {
    return this.http
      .post(this.deleteAttachmentApi, param)
      .toPromise()
      .then((response) => response);
  }
  getShippingDetails(param: any): Promise<any> {
    return this.http
      .post(this.getShippingDetailsApi, param)
      .toPromise()
      .then((response) => response);
  }
  getCheckOrdersPdf(param: any): Promise<any> {
    return this.http
      .post(this.getCheckOrdersPdfApi, param)
      .toPromise()
      .then((response) => response);
  }
  addInvoiceShipping(param: any): Promise<any> {
    return this.http
      .post(this.addInvoiceShippingApi, param)
      .toPromise()
      .then((response) => response);
  }
  OrderCoaData(param: any): Promise<any> {
    return this.http
      .post(this.OrderCoaDataApi, param)
      .toPromise()
      .then((response) => response);
  }
  invoiceStatus(param: any): Promise<any> {
    return this.http
      .post(this.invoiceStatusApi, param)
      .toPromise()
      .then((response) => response);
  }
  getPackageDetailsList(param: any): Promise<any> {
    return this.http
      .post(this.getPackageDetailsApi, param)
      .toPromise()
      .then((response) => response);
  }
  saveDrumDetail(param: any): Promise<any> {
    return this.http
      .post(this.saveDrumApi, param)
      .toPromise()
      .then((response) => response);
  }

  getClientsEmailList(param: any): Promise<any> {
    return this.http
      .post(this.getClientsEmailListApi, param)
      .toPromise()
      .then((response) => response);
  }
  getoriginFileAttachments(param: any): Promise<any> {
    return this.http
      .post(this.addFileAttachmentsApi, param)
      .toPromise()
      .then((response) => response);
  }

  deleteFileAttachments(param: any): Promise<any> {
    return this.http
      .post(this.deleteFileApi, param)
      .toPromise()
      .then((response) => response);
  }
  sendDocumentsMail(param: any): Promise<any> {
    return this.http
      .post(this.sendDocumentsMailApi, param)
      .toPromise()
      .then((response) => response);
  }
  getclientDocPermissions(param: any): Promise<any> {
    return this.http
      .post(this.clientDocPermissionsApi, param)
      .toPromise()
      .then((response) => response);
  }
  getDeliverDetails(param: any): Promise<any> {
    return this.http
      .post(this.getDeliverDetailsApi, param)
      .toPromise()
      .then((response) => response);
  }
  deleteFiles(param: any): Promise<any> {
    return this.http
      .post(this.deleteFilesApi, param)
      .toPromise()
      .then((response) => response);
  }

  saveIcttData(param: any): Promise<any> {
    return this.http
      .post(this.saveIcttApi, param)
      .toPromise()
      .then((response) => response);
  }
  mergeOrder(param: any): Promise<any> {
    return this.http
      .post(this.mergeOrderApi, param)
      .toPromise()
      .then((response) => response);
  }
  EditDescription(param: any): Promise<any> {
    return this.http
      .post(this.editdescription, param)
      .toPromise()
      .then((response) => response);
  }
  splitEstimateQuantity(param: any): Promise<any> {
    return this.http
      .post(this.splitEstimateqty, param)
      .toPromise()
      .then((response) => response);
  }
  generateBank(param: any): Promise<any> {
    return this.http
      .post(this.bankdetailsapi, param)
      .toPromise()
      .then((response) => response);
  }
  generateSavefiles(param: any): Promise<any> {
    return this.http
      .post(this.saveuploadfiles, param)
      .toPromise()
      .then((response) => response);
  }
  generateSavefreight(param: any): Promise<any> {
    return this.http
      .post(this.saveFreightform, param)
      .toPromise()
      .then((response) => response);
  }
  getfreight(param: any): Promise<any> {
    return this.http
      .post(this.getFreightform, param)
      .toPromise()
      .then((response) => response);
  }
  // generateadCodePdf(param: any): Promise<any> {
  //   return this.http
  //         .post(this.generateadCodePdfApi, param)
  //         .toPromise()
  //         .then(response => response)
  // }
  // generateSsiPdf(param: any): Promise<any> {
  //   return this.http
  //           .post(this.generateSsiPdfApi, param)
  //           .toPromise()
  //           .then(response => response)

  // }

  saveOtherCosts(param: any): Promise<any> {
    return this.http
      .post(this.saveOtherCostsApi, param)
      .toPromise()
      .then((response) => response);
  }

  getOtherCosts(param: any): Promise<any> {
    return this.http
      .post(this.getOtherCostsApi, param)
      .toPromise()
      .then((response) => response);
  }
  editFreightcost(param: any): Promise<any> {
    return this.http
      .post(this.editFreightApi, param)
      .toPromise()
      .then((response) => response);
  }
  editInsurance(param: any): Promise<any> {
    return this.http
      .post(this.editInsuranceApi, param)
      .toPromise()
      .then((response) => response);
  }

  saveOrdersContainers(param: any): Promise<any> {
    return this.http
      .post(this.saveOrdersContainersApi, param)
      .toPromise()
      .then((response) => response);
  }
  getexportRegister(param: any): Promise<any> {
    return this.http
      .post(this.getExportRegisterApi, param)
      .toPromise()
      .then((response) => response);
  }
  saveExportRegister(param: any): Promise<any> {
    return this.http
      .post(this.saveExportregisterApi, param)
      .toPromise()
      .then((response) => response);
  }
  saveTaxInvoice(param: any): Promise<any> {
    return this.http
      .post(this.saveTaxInvoiceApi, param)
      .toPromise()
      .then((response) => response);
  }
  updateEstimateApi(param: any): Promise<any> {
    return this.http
      .post(this.updateEstimateapi, param)
      .toPromise()
      .then((response) => response);
  }
  generateCustomsInvoice(param: any): Promise<any> {
    return this.http
      .post(this.generateCustomsInvoiceApi, param)
      .toPromise()
      .then((response) => response);
  }
  acceptQuotation(param: any): Promise<any> {
    return this.http
      .post(this.postAcceptQuotation, param)
      .toPromise()
      .then((response) => response);
  }
  updatelineitempopfi(param: any): Promise<any> {
    return this.http
      .post(this.updateEstimatealineitem, param)
      .toPromise()
      .then((response) => response);
  }
  saveOtherOrderDetails(param: any): Promise<any> {
    return this.http
      .post(this.saveOtherOrderDetailsApi, param)
      .toPromise()
      .then((response) => response);
  }

  getOtherOrderDetails(param: any): Promise<any> {
    return this.http
      .post(this.getOtherOrderDetailsApi, param)
      .toPromise()
      .then((response) => response);
  }

  saveTaxConversion(param: any): Promise<any> {
    return this.http
      .post(this.saveTaxConversionApi, param)
      .toPromise()
      .then((response) => response);
  }
  getproductOrders(param: any): Promise<any> {
    return this.http
      .post(this.getproductsPack, param)
      .toPromise()
      .then((response) => response);
  }
  addPackageApi(param: any): Promise<any> {
    return this.http
      .post(this.addPackage, param)
      .toPromise()
      .then((response) => response);
  }
  getProductPackageApi(param: any): Promise<any> {
    return this.http
      .post(this.getProductPackage, param)
      .toPromise()
      .then((response) => response);
  }
  saveAdcshettApi(param: any): Promise<any> {
    return this.http
      .post(this.saveAdcshett, param)
      .toPromise()
      .then((response) => response);
  }
  getAdcSheetinfo(param: any): Promise<any> {
    return this.http
      .post(this.getAdcsheet, param)
      .toPromise()
      .then((response) => response);
  }
  saveOrderDocumentSIDraftApi(param: any): Promise<any> {
    return this.http
      .post(this.saveOrderDocumentSIDraft, param)
      .toPromise()
      .then((response) => response);
  }
  getOrderDocumentSIDraftApi(param: any): Promise<any> {
    return this.http
      .post(this.getOrderDocumentSIDraft, param)
      .toPromise()
      .then((response) => response);
  }
  savePOApi(param: any): Promise<any> {
    return this.http
      .post(this.createPO, param)
      .toPromise()
      .then((response) => response);
  }
  getPOListApi(param: any): Promise<any> {
    return this.http
      .post(this.getPoList, param)
      .toPromise()
      .then((response) => response);
  }
  getPoActivityApi(param: any): Promise<any> {
    return this.http
      .post(this.getPoActivity, param)
      .toPromise()
      .then((response) => response);
  }
  getPoApi(param: any): Promise<any> {
    return this.http
      .post(this.getPo, param)
      .toPromise()
      .then((response) => response);
  }
  updatePOStatusApi(param: any): Promise<any> {
    return this.http
      .post(this.updatePOStatus, param)
      .toPromise()
      .then((response) => response);
  }
  updatePOInsuranceApi(param: any): Promise<any> {
    return this.http
      .post(this.updatePOInsurance, param)
      .toPromise()
      .then((response) => response);
  }
  updatePOFreightApi(param: any): Promise<any> {
    return this.http
      .post(this.updatePOFreight, param)
      .toPromise()
      .then((response) => response);
  }
  updatePOProductPriceApi(param: any): Promise<any> {
    return this.http
      .post(this.updatePOProductPrice, param)
      .toPromise()
      .then((response) => response);
  }
  updatePODiscountApi(param: any): Promise<any> {
    return this.http
      .post(this.updatePODiscount, param)
      .toPromise()
      .then((response) => response);
  }
  updatePODescriptionApi(param: any): Promise<any> {
    return this.http
      .post(this.updatePODescription, param)
      .toPromise()
      .then((response) => response);
  }
  savePOAttachmentsApi(param: any): Promise<any> {
    return this.http
      .post(this.savePOAttachments, param)
      .toPromise()
      .then((response) => response);
  }
  getPOAttachmentsApi(param: any): Promise<any> {
    return this.http
      .post(this.getPOAttachments, param)
      .toPromise()
      .then((response) => response);
  }
  deletePOAttachmentsApi(param: any): Promise<any> {
    return this.http
      .post(this.deletePOAttachments, param)
      .toPromise()
      .then((response) => response);
  }
  getOrderActivityLog(param: any): Promise<any> {
    let url = `${this.getActivityLog}?module=${param.module}&id=${param.id}`;
    return this.http
      .get(url)
      .toPromise()
      .then((response) => response);
  }
  getPOFiltersApi(param: any): Promise<any> {
    return this.http
      .post(this.getPOFilters, param)
      .toPromise()
      .then((response) => response);
  }
  sendEmailApi(param: any): Promise<any> {
    return this.http
      .post(this.sendPOEmail, param)
      .toPromise()
      .then((response) => response);
  }

  addCommercialInvoiceApi(param: any): Promise<any> {
    return this.http
      .post(this.addCommercialInvoice, param)
      .toPromise()
      .then((response) => response);
  }

  addPaymentsApi(param: any): Promise<any> {
    return this.http
      .post(this.addPayments, param)
      .toPromise()
      .then((response) => response);
  }

  getPaymentStatusApi(param: any): Promise<any> {
    return this.http
      .get(this.getPaymentStatus, param)
      .toPromise()
      .then((response) => response);
  }

  getCommercialInvoiceListApi(param: any): Promise<any> {
    return this.http
      .post(this.getCommercialInvoiceList, param)
      .toPromise()
      .then((response) => response);
  }
  getAddCompositeInvoice(param: any): Promise<any> {
    return this.http
      .post(this.addCompositeInvoice, param)
      .toPromise()
      .then((response) => response);
  }
  getImportProductsList(param: any): Promise<any> {
    return this.http
      .post(this.importProductsList, param)
      .toPromise()
      .then((response) => response);
  }
  updateProduct(param: any, apiname: string): Promise<any> {
    return this.http
      .post(apiname, param)
      .toPromise()
      .then((response) => response);
  }
  getTaxTypesApi(param: any): Promise<any> {
    let url = param.id
      ? `${this.getTaxTypes}?id=${param.id}`
      : `${this.getTaxTypes}?type=${param.type}`;
    return this.http
      .get(url, param)
      .toPromise()
      .then((response) => response);
  }

  uploadFileApi(param: any): Promise<any> {
    return this.http
      .post(this.uploadApi, param)
      .toPromise()
      .then((response) => response);
  }

  getViewDetails(param: any): Promise<any> {
    let url = `${this.viewDetails}?name=${param.type}&id=${
      param.id
    }&offset=${new Date().getTimezoneOffset()}`;
    return this.http
      .get(url, param)
      .toPromise()
      .then((response) => response);
  }
  generateSubTotals(param: any): Promise<any> {
    let url = App.base_url + `generateSubTotals`;
    return this.http
      .post(url, param)
      .toPromise()
      .then((response) => response);
  }
  createOrderFrmPFI(param: any): Promise<any> {
    let url = App.base_url + `createOrderFromPFI`;
    return this.http
      .post(url, param)
      .toPromise()
      .then((response) => response);
  }
  getOrderPermissions(param: any): Promise<any> {
    return this.http
      .post(this.orderPermissions, param)
      .toPromise()
      .then((response) => response);
  }
  editInLine(param: any) {
    return this.http
      .post(this.editInLineApi, param)
      .toPromise()
      .then((response) => response);
  }
  deleteContainer(param: any): Promise<any> {
    return this.http
      .post(App.base_url + `deleteContainer`, param)
      .toPromise()
      .then((response) => response);
  }
  getOrderDocumentApi(order_id: any): Promise<any> {
    return this.http
      .get(`${this.getOrderDocument}/${order_id}`)
      .toPromise()
      .then((response) => response);
  }
  getDocuments(param: any): Promise<any> {
    return this.http
      .post(App.base_url + `getDocuments`, param)
      .toPromise()
      .then((response) => response);
  }
  getOrderDocuments(param: any): Promise<any> {
    return this.http
      .post(App.base_url + `getOrderDocuments`, param)
      .toPromise()
      .then((response) => response);
  }
  getQuotationDocuments(param: any): Promise<any> {
    return this.http
      .post(App.base_url + `getQuotationDocuments`, param)
      .toPromise()
      .then((response) => response);
  }
  getShipmentDocuments(param: any): Promise<any> {
    return this.http
      .post(App.base_url + `getShipmentDocuments`, param)
      .toPromise()
      .then((response) => response);
  }
  getPoDocuments(param: any): Promise<any> {
    return this.http
      .post(App.base_url + `getPoDocuments`, param)
      .toPromise()
      .then((response) => response);
  }
  orderShipments(order_id: any): Promise<any> {
    return this.http
      .get(`${this.getorderShipments}/${order_id}`)
      .toPromise()
      .then((response) => response);
  }
  saveOrderDocumentApi(param: any): Promise<any> {
    return this.http
      .put(`${this.saveOrderDocument}/${param.document_id}`, param)
      .toPromise()
      .then((response) => response);
  }
  generateCommercialInvoice(param: any): Promise<any> {
    return this.http
      .post(this.generateCommercialInvoiceApi, param)
      .toPromise()
      .then((response) => response);
  }
  deleteFromData(param: any): Promise<any> {
    return this.http
      .post(this.postDeleteFromData, param)
      .toPromise()
      .then((response) => response);
  }
  createPackage(param: any): Promise<any> {
    return this.http
      .post(param.id ? this.postUpdatePackage : this.postCreatePackage, param)
      .toPromise()
      .then((response) => response);
  }
  createShipmentFromOrder(param: any): Promise<any> {
    return this.http
      .post(this.postCreateShipmentFromOrder, param)
      .toPromise()
      .then((response) => response);
  }
  createContainer(param: any): Promise<any> {
    return this.http
      .post(this.postCreateContainer, param)
      .toPromise()
      .then((response) => response);
  }

  getPackages(order_id: any): Promise<any> {
    return this.http
      .get(`${this.getPackagesApi}?id=${order_id}`)
      .toPromise()
      .then((response) => response);
  }

  quotationOrders(param: any): Promise<any> {
    return this.http
      .post(this.postQuotationOrders, param)
      .toPromise()
      .then((response) => response);
  }
  getImportPackageList(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "saveOpenFormatPacking", param)
      .toPromise()
      .then((response) => response);
  }
  deleteOpenFormatPackage(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "deleteOpenFormatPacking", param)
      .toPromise()
      .then((response) => response);
  }
  updateShipperAddress(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "updateShipperAddress", param)
      .toPromise()
      .then((response) => response);
  }
  getInvStatusUpdate(params: any): Promise<any> {
    return this.http
      .get(App.base_url + `getInvStatusUpdate?id=${params.id}`)
      .toPromise()
      .then((response) => response);
  }
  editNumberingSeries(param: any): Promise<any> {
    let url = App.base_url + `editNumberingSeries`;
    return this.http
      .post(url, param)
      .toPromise()
      .then((response) => response);
  }
  editInvoiceNumber(param: any): Promise<any> {
    let url = App.base_url + `editInvoiceNumber`;
    return this.http
      .post(url, param)
      .toPromise()
      .then((response) => response);
  }
}
