import { ContactsViewService } from './../../services/contacts-view.service';
import { AddContactComponent } from './../../dialogs/add-contact/add-contact.component';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterModule, NavigationStart } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Images } from '../../images/images.module';
import { language } from '../../language/language.module';
import { SnakbarService } from '../../services/snakbar.service';
declare var App: any;

@Component({
  selector: 'app-contact-mainview',
  templateUrl: './contact-mainview.component.html',
  styleUrls: ['./contact-mainview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('overviewAnimate', [
      transition(':enter', [
        query('*', [
          style({ transform: 'translateX(-100px)', opacity: 0 }),
          stagger(10, [
            animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
          ])
        ])
      ])
    ]),
    trigger('ordersAnimate', [
			transition(':enter', [
				style({ transform: 'translateX(-100px)', opacity: 0 }),
				animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
			])
		]),
    trigger('overviewAnimateLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
      ])
    ]),

    trigger('zoomAnimate', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),

    trigger('overviewFadeAnimate', [
      transition(':enter', [
        query('*', [
          style({ opacity: 0 }),
          stagger(5, [
            animate('1000ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
          ])
        ])
      ])
    ]),


  ]
})
export class ContactMainviewComponent implements OnInit {
  private images = Images;
  private App = App;
  fetchingData = true;
  private emptyOrdersData: boolean = true;
  public createOrderPermission: boolean;
  public invoicePermission: boolean;
  public ordersPermission: boolean;
  private emptyInvoiceData: boolean = true;
  public clientPermission : any;
  public newOrdersCount : number;
  public language = language;
  activeState: boolean;
  overViewCompanyData:any;
  searching: boolean;
  public Types = [
 
  {id: 1, name: 'Admin', selected: false}, 
  {id: 2, name: 'Client', selected: false},
  {id: 1, name: 'Employee', selected: false},
  {id: 4, name: 'Lead', selected: false}, 
  {id: 3, name: 'Supplier', selected: false},
  
];
  public today = new Date();
  orders = {
    ordersList: [],
    invoicesList: [],
    newOrders: '',
    ordersCount: '',
    deliversToday: '',
    totalDue: '',
    totalPastDue: ' ',
    totalDueINR: '',
    totalPastDueINR:'',
    veganRemaining: [],
    spectrumRemaining: [],
    currency_type: { 'currency_type': '', 'id': '' },

  };
	totalPages: number = 2500;
  public showFilter = false;
  filtersLoader = true;
  public totalContacts;
  public open = false;
  private timeout;
  public groupArray = [];
  public params = {
		pageSize: 10,
		page: 1,
    search: '',
    sort: 'asc',
    log_type: []
  }
  public count = 0;
  public typearr = [];
  ngOnInit() {
    this.titleService.setTitle('Expodite-Contacts');
    this.overViewCompanyData  = App['company_data'];
    this.getListOverview();
    let createOrder: boolean;
    let clientView: boolean;
    let orderPermism: boolean;
    let invPermisn: boolean;
    


    App.user_roles_permissions.map(function (value) {
      switch (value.code) {
        case 'order':

          if (value.selected === true) {
            createOrder = true;
          } else {
            createOrder = false;

          }
          break;
          case 'client_interface' :
          if (value.selected === true) {
            clientView = true;
          } else {
            clientView = false;

          }
          break;
        case 'orders':
          if (value.selected === true) {
            orderPermism = true;
          } else {
            orderPermism = false;

          }
          break;
        case "invoices":
          if (value.selected == true) {
            invPermisn = true;
          } else {
            invPermisn = false;

          }
          break;


      }

    });
    this.clientPermission = clientView;
    // console.log(this.clientPermission)
    this.invoicePermission = invPermisn;
    this.ordersPermission = orderPermism;
    this.createOrderPermission = createOrder;

  }
  constructor(
    private titleService: Title,
    private router: Router,
    private cookie: CookieService,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private contactsViewService: ContactsViewService
  ) { }
  displayedColumns = ['firstname', 'org_name', 'email', 'user_type', 'status'];
  displayedClientColumns = ['po_nbr', 'total_quantity', 'total_amount',  'order_status'];
  displayedOrderList = ['inv_nbr', 'client_name', 'total_amount', 'order_status'];
  dataSource = new MatTableDataSource();
  invoiceDataSource = new MatTableDataSource();
  
  getPageParams() {
    let a = []
    let params = {
      pageSize: 10,
      page: this.params.page,
      search: this.params.search,
      sort: 'asc',
      log_type: []
    }

    this.Types.map(function (value, index) {
			if (value.selected) {
        params.log_type.push(value.id);

        if(value.name == 'Admin') {
          params['type'] = 'Admin';
        } else if(value.name == 'Employee') {
          params['type'] = 'Employee';
        }
  
      }
      if(value.selected && value.name == 'Admin') {
        a.push(value.name)
      } else if(value.selected && value.name == 'Employee') {
        a.push(value.name)
      } 
      // if(value.selected && value.name == "Admin") {
      //   params['type'] = 'Admin';
      // } else if(value.selected && value.name == "Employee") {
      //   params['type'] = 'Employee'
      // }
    });
    // console.log(a)

    if(a.length == 2) {
      params['type'] = 'All'
    } else {
      params['type'] = a[0]
    }
   

    return params
  }

  contactDetails(rowdata) {
    console.log(rowdata);
    this.contactsViewService.contactRowdata = rowdata;
    if(rowdata.user_type == "Supplier Contact") {
      this.router.navigate(['vendors'])
    } else if(rowdata.user_type == "Client Contact") {
      this.router.navigate(['clients'])
    } else if(rowdata.user_type == "Admin User") {
      this.router.navigate(['admin/users'])
    } 
  }
  public clonearr = [];
  public arrayData = [];
  public onscrolled = false;
  getListOverview(clearList?: any): void {
    // console.log(1234)
  	if (clearList) {
			this.fetchingData = true;
			this.params.page = 1;
		}
    this.contactsViewService
      .getUserList( this.getPageParams() )
      .then(response => {
        this.fetchingData = false;
        this.filtersLoader = false;
        if (response.result.success) {
         
          if (clearList) {
            this.dataSource.data = [];
            this.clonearr = [];
					}
          let data = response.result.data.users;
      
      
          this.clonearr = [...this.clonearr, ...data];
        
          this.dataSource.data = this.clonearr;
					this.searching = false;

          // this.dataSource.data = response.result.data.users;
          this.totalContacts = response.result.data.count;
          this.groupArray = response.result.data.groupsDt;
          // this.invoiceDataSource.data = response.result.data.invoice;
          if (this.dataSource.data && this.dataSource.data.length) {
            this.emptyOrdersData = false;
          } else {
            this.emptyOrdersData = true;
          }

          this.onscrolled = false;
          // this.orders.currency_type.currency_type = response.result.data.currency_type.currency_type;

          // if (this.orders.invoicesList && this.orders.invoicesList.length) {
          //   this.emptyInvoiceData = false;
          // } else {
          //   this.emptyInvoiceData = true;
          // }
        }
      });
  }
	selectState() {
		this.activeState = true;
  }

  searchOrders(search: string, event?: any): void {
		this.params.search = search;
		this.params.page = 1;
		this.searching = true;
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.timeout = setTimeout(() => {
			this.getListOverview(true);
		}, 1000);
	}
  applyFilterData() {
		this.params.page = 1;
		this.searching = true;
		let toast: object;
		toast = { msg: 'Filters applied successfully.', status: 'success' };
		this.getListOverview(true);
		this.snackbar.showSnackBar(toast);
	}
  checkboxChange(data: any): void {
    // console.log(data)
  
		data.selected = !data.selected;
		this.showFilter = true;
	}
  onScroll(): void {
    console.log('calledddd')
    // this.getListOverview();
    // return
		if (this.params.page < this.totalPages && this.totalPages != 0) {
      console.log(1)
      this.onscrolled = true;
      this.params.page++;
			this.getListOverview();
		}
  }
  
  public newcontactObj = {
  
  }
  createOrder() {
    let toast: object;
    let object = {
      groupArray: this.groupArray
    }
    let dialogRef = this.dialog.open(AddContactComponent, {
      panelClass: 'alert-dialog',
      width: '600px',
      data: object
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      let newcontactobject = {}
      if (result.success) {
       this.newcontactObj =  result.response;
      //  newcontactobject['email'] = this.newcontactObj.email;
      //  newcontactobject['name'] = this.newcontactObj.firstname;
      //  newcontactobject['status'] = 'Active';

      //  newcontactobject['email'] = this.newcontactObj.email;

       // const config = this.router.config.map((route) => Object.assign({}, route));
        // this.router.resetConfig(config);
        // this.cookie.set('order_id', result.response);
        // this.router.navigate(['/orders']);
        // let toast: object;
        // toast = { msg: "Order Created Successfully...", status: "success" };
        // this.snackbar.showSnackBar(toast);
        // this.dataSource.data.splice(0, 1);
        // this.dataSource.data.unshift(this.newcontactObj);
        // this.dataSource.data[0] = this.newcontactObj;
        this.totalContacts++;
        this.dataSource.data.unshift(this.newcontactObj);
        this.dataSource.filter = '' ;
        // console.log(this.dataSource.data)
      }
      // console.log(this.newcontactObj)
      // this.dataSource.data.pop();
     
    });
  }

  clearFilterData() {
    this.showFilter = false;
    this.Types.map(function (value) {
			value.selected = false;
		});
    this.getListOverview(true);
	}
  orderDetail(row) {
    // console.log(row)
    this.cookie.set('order_id', row.orders.id);
    this.router.navigate(['/orders']);
  }

  invoiceDetail(row) {
    this.cookie.set('invoice_id', row.Inovice.id);
    this.router.navigate(['/invoices']);
  }
}

// orderDetail(row) {
//   console.log(row)
//   if(this.OrdersService.orderRedirect){
//     this.cookie.set('order_id', row.orders.id);
//     this.router.navigate(['/orders']);
//     console.log(this.OrdersService.orderRedirect);
//   }else{
//     console.log(this.OrdersService.orderRedirect);
//   }


// }