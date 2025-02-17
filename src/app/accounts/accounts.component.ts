import { Component, OnInit } from '@angular/core';
import { Images } from './../images/images.module';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  private images = Images;
  constructor() { }

  ngOnInit(): void {
  }
  sideList: Array<any> = [
    

    { id: 1, name: 'IGST', route: 'igst', icon: this.images.igst, },
    // { id: 2, name: 'Invoices', route: 'invoices',  icon: this.images.invoice_ac,},
    // { id: 1, name: 'Payments', route: 'payments',  icon: this.images.company_img,},
    { id: 3, name: 'Credit Notes', route: 'credit',icon: this.images.credit,  },
    { id: 4, name: 'Debit Notes', route: 'debit',  icon: this.images.debit,},
    

  ];
}
