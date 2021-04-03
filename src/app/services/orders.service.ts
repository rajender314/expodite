import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, CanActivate, Router } from '@angular/router';
import { promise } from 'protractor';
import * as _ from 'lodash';

declare var App: any;

@Injectable({
  'providedIn':'root'
})
export class OrdersService  implements CanActivate{
   
  orderRedirect = false;
  public routeAllowed = false;
  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    let i = _.findIndex(<any>App.env_configurations.env_config, {
      name: 'Orders'
    });
    // console.log(i)
    if( i > -1  && App.env_configurations.env_config[i].display == 'yes') {
      this.routeAllowed = true;
    } else {
      this.routeAllowed = false;
  
    }
    // console.log(this.routeAllowed)
    // console.log((ActivatedRouteSnapshot))
    // console.log(App.user_roles_permissions.filter(function(value){return (value.code=='orders' && value.selected);}).length) 
    if (((ActivatedRouteSnapshot.routeConfig.path == 'orders') && 
    App.user_roles_permissions.filter(function(value){return (value.code=='orders' && value.selected);}).length) &&
    this.routeAllowed
    ) {
      // this.orderRedirect = true;
      return true;
      
    }else{
      // console.log(1111111)
      this.router.navigate(['access-denied']);
      // this.orderRedirect = false;
      return false;
    }

  }



  private ordersListApi   = App.base_url + 'getListOrders';
  private shipperAddr   = App.base_url + 'getCompanyShpAddr';
  private createOrdertApi = App.base_url + 'addOrders';
  private changeOrderPrice = App.base_url + 'updateProductPrice';
  private invoiceListApi   = App.base_url + 'getOrdersInv';
  private overviewList    =   App.base_url + 'getListOverview';
  private acceptOrdertApi = App.base_url + 'updateOrdersId';
  private packagingDetailsApi = App.base_url + 'getOrdersPackage';
  private ActivityDetailsApi = App.base_url + 'getOrdersActivity';
  private addBatchNumberApi = App.base_url + 'AddOrdersPackage';
  private generateInvoiceApi = App.base_url + 'generateInvoice';
  private getOrdersInvApi = App.base_url + 'getOrdersInv';
  private addOrdersSdfApi = App.base_url + 'addOrdersSdf';
  private addOrdersExpApi = App.base_url + 'addOrderExp';
  private getOrdersSdfApi = App.base_url + 'getOrdersSdf';
  private getOrdersExpApi = App.base_url + 'getOrderExp';
  private addOrdersConcernApi = App.base_url + 'addOrdersConcern';
  private getOrdersConernApi = App.base_url + 'getOrdersConcern';
  private getListOrdersAttApi = App.base_url + 'getListOrdersAtt';
  private deleteAttachmentApi = App.base_url + 'deleteOrdersAtt';
  
  private getShippingDetailsApi = App.base_url + 'getShippingTrack';
  private getCheckOrdersPdfApi = App.base_url + 'checkOrdersPdf';
  private addInvoiceShippingApi = App.base_url + 'addInvoiceShipping';
  private OrderCoaDataApi = App.base_url + 'getOrdBtchCoa';
  // private exportPdfApi = App.base_url + 'zipOrdersPdf';
  private exportPdfApi = App.base_url + 'downloadALlOtherDocs';
  private invoiceStatusApi = App.base_url + 'updateInvoiceStatus';
  private editOrderDetailsApi = App.base_url + 'editOrderDetails';
  private getPackageDetailsApi = App.base_url + 'getPackageDetails';
  private saveDrumApi = App.base_url + 'saveDrum';
  private sendDocumentsMailApi = App.base_url + 'sendDocumentsMail';
  private addFileAttachmentsApi = App.base_url + 'getFiles';
  private deleteFileApi = App.base_url + 'deleteFiles';
  private getClientsEmailListApi = App.base_url + 'getClientsEmailList';
  private clientDocPermissionsApi = App.base_url + 'clientDocPermissions';
  private getDeliverDetailsApi = App.base_url + 'getDeliverDetails';
  private deleteFilesApi = App.base_url + 'deleteFiles';
  private getPaymentTypesApi = App.base_url + 'getPaymentTypes';

  private getOrdersFilterApi = App.base_url + 'getOrderFilters';	
  private getInvoiceFilterApi = App.base_url + 'getInvoiceFilters';	
  private updateOrdersPackageApi = App.base_url + 'updateOrdersPackage';	
  private getUom = App.base_url + 'getUom';	
  private getPrimaryPackingDetails = App.base_url + 'getPrimaryPackingDetails';	


  // private generateadCodePdfApi = App.base_url + 'generateadCodePdf';
  // private generateSsiPdfApi = App.base_url + 'generateSsiPdf';
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  constructor(private http: HttpClient,
    public router: Router) { }

  getInvoiceList(param: any): Promise<any>{

    return this.http
    .post(this.invoiceListApi, param)
    .toPromise()
    .then(response => response);
  } 

  getUomData(param: any): Promise<any>{

    return this.http
    .post(this.getUom, param)
    .toPromise()
    .then(response => response);
  }
  getPaymentTypes(): Promise<any>{

    return this.http
    .post(this.getPaymentTypesApi, {})
    .toPromise()
    .then(response => response);
  } 
  getPrimaryPackageData(param: any): Promise<any>{

    return this.http
    .post(this.getPrimaryPackingDetails, param)
    .toPromise()
    .then(response => response);
  } 
  changePoNumbr(param: any): Promise<any>{

    return this.http
    .post(this.editOrderDetailsApi, param)
    .toPromise()
    .then(response => response);
  } 

  getOrdersList(param: any): Promise<any> {
    return this.http
      .post(this.ordersListApi, param)
      .toPromise()
      .then(response => response);
  }

  getShipperAddress(param: any): Promise<any> {
    return this.http
      .post(this.shipperAddr, param)
      .toPromise()
      .then(response => response);
  }
  exportOrdersPdf(param: any): Promise<any> {
    return this.http
      .post(this.exportPdfApi, param)
      .toPromise()
      .then(response => response);
  }
  getOverviewList(param: any): Promise<any> {
    return this.http
      .post(this.overviewList, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }
  createOrder(param: any): Promise<any> {
    return this.http
      .post(this.createOrdertApi, param)
      .toPromise()
      .then(response => response);
  }
  updateOrdersPackage(param: any): Promise<any> {
    return this.http
      .post(this.updateOrdersPackageApi, param)
      .toPromise()
      .then(response => response);
  }
  addOrdersSdf(param: any): Promise<any> {
    return this.http
      .post(this.addOrdersSdfApi, param)
      .toPromise()
      .then(response => response);
  }
  addOrdersExp(param: any): Promise<any> {
    return this.http
    .post(this.addOrdersExpApi, param)
    .toPromise()
    .then(response => response);

  }
  addOrdersConcern(param: any): Promise<any> {
    return this.http
      .post(this.addOrdersConcernApi, param)
      .toPromise()
      .then(response => response);
  }
  getOrdersConcern(param: any): Promise<any> {
    return this.http
      .post(this.getOrdersConernApi, param)
      .toPromise()
      .then(response => response);
  }
  getOrdersSdf(param: any): Promise<any> {
    return this.http
      .post(this.getOrdersSdfApi, param)
      .toPromise()
      .then(response => response);
  }
  getOrderFilterData(param: any): Promise<any> {	
    return this.http	
      .post(this.getOrdersFilterApi, param)	
      .toPromise()	
      .then(response => response);	
  }
  getInvoiceFilterList(param: any): Promise<any> {	
    return this.http	
      .post(this.getInvoiceFilterApi, param)	
      .toPromise()	
      .then(response => response);	
  }
  getOrdersExport(param: any): Promise<any> {
    return this.http
      .post(this.getOrdersExpApi, param)
      .toPromise()
      .then(response => response);
  }
 changePrice(param:any): Promise<any>{
  return this.http
  .post(this.changeOrderPrice, param)
  .toPromise()
  .then(response => response);
 }

  acceptOrder(param: any): Promise<any> {
    return this.http
      .post(this.acceptOrdertApi, param)
      .toPromise()
      .then(response => response);
  }
  getPackagingOrderDetails(param: any): Promise<any> {
    return this.http
      .post(this.packagingDetailsApi, param)
      .toPromise()
      .then(response => response);
  }
  getActivtyDetails(param: any): Promise<any> {
    return this.http
      .post(this.ActivityDetailsApi, param)
      .toPromise()
      .then(response => response);
  }

  saveBatchNumber(param: any): Promise<any> {
    return this.http
      .post(this.addBatchNumberApi, param)
      .toPromise()
      .then(response => response);
  }
  generateInvoice(param: any): Promise<any> {
    return this.http
      .post(this.generateInvoiceApi, param)
      .toPromise()
      .then(response => response);
  }
  getInvoiceData(param: any): Promise<any> {
    return this.http
      .post(this.getOrdersInvApi, param)
      .toPromise()
      .then(response => response);
  }
  getAttachmentsList(param: any): Promise<any> {
    return this.http
      .post(this.getListOrdersAttApi, param)
      .toPromise()
      .then(response => response);
  }
  deleteAttachment(param: any): Promise<any> {
    return this.http
      .post(this.deleteAttachmentApi, param)
      .toPromise()
      .then(response => response);
  }
  getShippingDetails(param: any): Promise<any> {
    return this.http
      .post(this.getShippingDetailsApi, param)
      .toPromise()
      .then(response => response);
  }
  getCheckOrdersPdf(param: any): Promise<any> {
    return this.http
    .post(this.getCheckOrdersPdfApi, param)
      .toPromise()
      .then(response => response);
  }
  addInvoiceShipping(param: any): Promise<any> {
    return this.http
      .post(this.addInvoiceShippingApi, param)
      .toPromise()
      .then(response => response);
  }
  OrderCoaData(param: any): Promise<any> {
    return this.http
      .post(this.OrderCoaDataApi, param)
      .toPromise()
      .then(response => response);
  }
  invoiceStatus(param: any): Promise<any> {
    return this.http
      .post(this.invoiceStatusApi, param)
      .toPromise()
      .then(response => response);
  }
  getPackageDetailsList(param:any): Promise<any> {
    return this.http
          .post(this.getPackageDetailsApi,param)
          .toPromise()
          .then(response => response)
  }
  saveDrumDetail(param:any):Promise<any> {
    return this.http  
            .post(this.saveDrumApi,param)
            .toPromise()
            .then(response => response)
  }

  getClientsEmailList(param:any):Promise<any> {
    return this.http  
      .post(this.getClientsEmailListApi,param)
            .toPromise()
            .then(response => response)
  }
  getoriginFileAttachments(param:any): Promise<any>{
    return this.http  
    .post(this.addFileAttachmentsApi,param)
    .toPromise()
    .then(response => response)
    
  }
  
  deleteFileAttachments(param:any): Promise<any>{
    return this.http  
    .post(this.deleteFileApi,param)
    .toPromise()
    .then(response => response)
    
  }
  sendDocumentsMail(param:any):Promise<any> {
    return this.http  
            .post(this.sendDocumentsMailApi,param)
            .toPromise()
            .then(response => response)
  }
  getclientDocPermissions(param: any): Promise<any> {
    return this.http
      .post(this.clientDocPermissionsApi, param)
      .toPromise()
      .then(response => response)
  }
  getDeliverDetails(param: any): Promise<any> {
    return this.http
      .post(this.getDeliverDetailsApi, param)
      .toPromise()
      .then(response => response)
  }
  deleteFiles(param: any): Promise<any> {
    return this.http
      .post(this.deleteFilesApi, param)
      .toPromise()
      .then(response => response)
  }
  // generateSkpPdfs(param: any): Promise<any> {
  //   return this.http
  //     .post(this.generateSkpPdfApi, param)
  //     .toPromise()
  //     .then(response => response);
  // }
  // generateLutPdf(param: any): Promise<any> {
  //   return this.http
  //     .post(this.generateLutPdfApi, param)
  //     .toPromise()
  //     .then(response => response);
  // }
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
}
