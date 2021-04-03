import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {ViewEncapsulation} from '@angular/core';
import { Images } from '../../images/images.module';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
import * as _ from 'lodash';
declare var App: any;
import { AdminService } from '../../services/admin.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
      trigger('AdminListAnimate', [
          transition(':enter', [
              style({ transform: 'translateX(-100px)', opacity: 0 }),
              animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
          ])
      ])
  ],
  providers: [Title, AdminService]
})
export class AdminComponent implements OnInit {
  private routerActive = '';
  private images = Images;
  private usersIcon: string = App.public_url + 'signatures/assets/images/users-icon2.svg';

  sideList: Array<any> = [
    { id: 8, name: 'Company', route: 'company', icon: this.images.company_img, selected: true, code: "company"},
    { id: 3, name: 'Contact Addresses', route: 'address', icon: this.images.contactAddress, selected: true, code: "contacts" },

    { id: 1, name: 'Roles', route: 'roles', icon: this.images.roles, selected: true, code: "roles" },
    { id: 0, name: 'Users', route: 'users', icon: this.usersIcon, selected: true, code: "users" },

    { id: 6, name: 'Categories', route: 'category', icon: this.images.category, selected: true, code: "categories" },
    { id: 4, name: 'Products', route: 'products', icon: this.images.products, selected: true, code: "products" },
    { id: 5, name: 'Couriers', route: 'shipments', icon: this.images.shipments, selected: true, code: "couriers" },
    { id: 2, name: 'Packaging', route: 'containers', icon: this.images.containers, selected: true, code: "packaging" },
    { id: 10, name: 'Primary Packaging', route: 'primary-packaging', icon: this.images.containers, selected: true, code: "packaging" },

    { id: 7, name: 'Lead Attributes', route: 'lead-attribute', icon: this.images.category, selected: false, code: "lead_attributes" },
    { id: 9, name: 'Settings', route: 'settings', icon: this.images.admin_settings, selected: true, code:"settings"},

  ];
  constructor(
    private titleService: Title,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    // console.log(this.images);
    this.titleService.setTitle(App['company_data'].AdminTitle);
    this.updatePermissions();
    this.sideList = this.sideList.filter(obj => {
      return obj.selected == true;
    })
  }


  updatePermissions() {
    // console.log('sdsdsd')
    for(let i = 0; i < App.user_roles_permissions.length; i++) {
      // console.log('sdsdsd')
      if(!App.user_roles_permissions[i].selected) {
        // console.log('sdsdsd')
      for(let j = 0; j < this.sideList.length; j++) {
        // console.log('sdsdsd')
        if(App.user_roles_permissions[i].code.trim() == this.sideList[j].code.trim()) {
          // console.log('sdsdsd')
          this.sideList[j].selected = App.user_roles_permissions[i].selected;
        }
      }
     }
    }
    // console.log(this.sideList)
  }

  goToList(list) {
    this.adminService.reloadRoute(list);
  }

}
