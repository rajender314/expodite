export class PostCommercialInvoiceModel {
  edittaxInvoicenotify1: boolean;
  customs_notify_address1: string;
  edittaxInvoicenotify2: boolean;
  customs_notify_address2: string;
  editBilltoParty: boolean;
  editShiptoParty: boolean;
  editedBillAddress: string;
  editedShipAddress: string;

  constructor(
    edittaxInvoicenotify1: boolean,
    edittaxInvoicenotify2: boolean,
    editBilltoParty: boolean,
    editShiptoParty: boolean,
    customs_notify_address1: string,
    customs_notify_address2: string,
    editedBillAddress: string,
    editedShipAddress: string
  ) {
    this.edittaxInvoicenotify1 = edittaxInvoicenotify1;
    this.customs_notify_address1 = customs_notify_address1;
    this.edittaxInvoicenotify2 = edittaxInvoicenotify2;
    this.customs_notify_address2 = customs_notify_address2;
    this.editBilltoParty = editBilltoParty;
    this.editShiptoParty = editShiptoParty;
    this.editedBillAddress = editedBillAddress;
    this.editedShipAddress = editedShipAddress;
  }


}
