import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ViewEncapsulation } from "@angular/core";
import { Images } from "../../images/images.module";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import * as _ from "lodash";
declare var App: any;
import { AdminService } from "../../services/admin.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("AdminListAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
  // providers: [Title, AdminService],
})
export class AdminComponent implements OnInit {
  private routerActive = "";
  private images = Images;
  private usersIcon: string =
    App.public_url + "signatures/assets/images/users-icon2.svg";
  public is_automech = App.env_configurations.is_automech;
  public is_aapl = App.env_configurations.is_aapl;
  // sideList: Array<any> = [
  //   {
  //     id: 8,
  //     name: "Company",
  //     route: "company",
  //     icon: this.images.company_img,
  //     selected: true,
  //     code: "company",
  //   },
  //   {
  //     id: 3,
  //     name: "Contact Addresses",
  //     route: "address",
  //     icon: this.images.contactAddress,
  //     selected: true,
  //     code: "contact_addresses",
  //   },
  //   {
  //     id: 13,
  //     name: "Customs Addresses",
  //     route: "customs-address",
  //     icon: this.images.contactAddress,
  //     selected: true,
  //     code: "customs_addresses",
  //   },
  //   {
  //     id: 14,
  //     name: "Insurance Percentage",
  //     route: "insurance-percentage",
  //     icon: this.images.insurance_percentage,
  //     selected: true,
  //     code: "insurance_percentage",
  //   },
  //   {
  //     id: 1,
  //     name: "Roles",
  //     route: "roles",
  //     icon: this.images.roles,
  //     selected: true,
  //     code: "roles",
  //   },
  //   {
  //     id: 0,
  //     name: "Users",
  //     route: "users",
  //     icon: this.usersIcon,
  //     selected: true,
  //     code: "users",
  //   },

  //   {
  //     id: 6,
  //     name: "Categories",
  //     route: "category",
  //     icon: this.images.category,
  //     selected: true,
  //     code: "categories",
  //   },
  //   {
  //     id: 4,
  //     name: "Products",
  //     route: "products",
  //     icon: this.images.products,
  //     selected: true,
  //     code: "products",
  //   },
  //   {
  //     id: 5,
  //     name: "Carriers",
  //     route: "shipments",
  //     icon: this.images.shipments,
  //     selected: true,
  //     code: "couriers",
  //   },
  //   // {
  //   //   id: 2,
  //   //   name: "Packaging",
  //   //   route: "containers",
  //   //   icon: this.images.containers,
  //   //   selected: true,
  //   //   code: "packaging",
  //   // },
  //   // {
  //   //   id: 10,
  //   //   name: "Document Templates",
  //   //   route: "document-template",
  //   //   icon: this.images.admin_settings,
  //   //   selected: true,
  //   //   code: "templates",
  //   // },
  //   // { id: 10, name: 'Primary Packaging', route: 'primary-packaging', icon: this.images.containers, selected: true, code: "primary_packaging" },
  //   {
  //     id: 11,
  //     name: "Conversion Rates",
  //     route: "conversion-rates",
  //     icon: this.images.containers,
  //     selected: true,
  //     code: "conversion_rates",
  //   },
  //   // {
  //   //   id: 7,
  //   //   name: "Form Builder",
  //   //   route: "lead-attribute",
  //   //   icon: this.images.category,
  //   //   selected: true,
  //   //   code: "lead_attributes",
  //   // },
  //   {
  //     id: 12,
  //     name: "Incoterms",
  //     route: "inco-terms",
  //     icon: this.images.coa_small,
  //     selected: true,
  //     code: "inco_terms",
  //   },
  //   {
  //     id: 9,
  //     name: "Settings",
  //     route: "settings",
  //     icon: this.images.admin_settings,
  //     selected: true,
  //     code: "settings",
  //   },
  // ];

  sideList: any = [];
  constructor(
    private titleService: Title,
    private adminService: AdminService,
    private router: Router,
    private http: HttpClient
  ) {}
  public moduleId = ""
  ngOnInit() {
    // console.log(this.images);
  


    this.titleService.setTitle(App["company_data"].AdminTitle);
    // this.updatePermissions();
    // this.adminService.getSecondLevelMenus();
    
    this.adminService.SecondLevelMenus.subscribe((res) => {
      this.sideList = res;
      //  if(this.sideList.length) {
      //   this.router.navigate([`admin/${this.sideList[0].routerlink}`]);

      //  }
    });

    this.adminService.getModuleId().subscribe((res) => {
      this.moduleId = res;
    })

    this.getSecondLevelMenus();

  }
  getSecondLevelMenus() {
    const path = window.location.pathname
    const parts = path.split("/").filter(Boolean);
    this.http
      .get<any>(`${App.base_url}${"secondLevelMenus"}?type=${parts[0]}`)
      .subscribe(async (res) => {
        if (res.result.success) {
          const data = res.result.data;
          this.sideList = data.env_config;
          if(this.sideList.length && parts.length < 2) {
          this.router.navigate([`admin/${this.sideList[0].routerlink}`]);
          }
        }
      });
  }

  updatePermissions() {
    // console.log(App.user_roles_permissions);
    for (let i = 0; i < App.user_roles_permissions.length; i++) {
      // console.log('sdsdsd')
      if (!App.user_roles_permissions[i].selected) {
        // console.log('sdsdsd')
        for (let j = 0; j < this.sideList.length; j++) {
          // console.log('sdsdsd')
          if (
            App.user_roles_permissions[i].code.trim() ==
            this.sideList[j].code.trim()
          ) {
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
