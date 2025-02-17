import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryInfoComponent } from './inventory/inventory-info/inventory-info.component';
import { InventoryMergeComponent } from './inventory/inventory-merge/inventory-merge.component';
import { DeleteInventoryComponent } from './../dialogs/delete-inventory/delete-inventory.component';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';
import { InventoryDetailsComponent } from './inventory/inventory-details/inventory-details.component';
import { AddInventoryComponent } from './../dialogs/add-inventory/add-inventory.component';
import { InventoryComponent } from './inventory/inventory.component';

import { SharedModule } from './../shared/shared.module';
import { HttpInterceptorService } from './../services/http-interceptor.service';
import { NgModule } from '@angular/core';


import {  HTTP_INTERCEPTORS } from '@angular/common/http';


import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TableComponent } from '../custom-material/table/table.component';
import { CommonModule } from '@angular/common';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
      suppressScrollX: true
    };
     

@NgModule({
  declarations: [
    InventoryComponent,
    AddInventoryComponent,
    TableComponent,
    InventoryDetailsComponent,
    InventoryListComponent,
    DeleteInventoryComponent,
    InventoryMergeComponent,
    InventoryInfoComponent,
   ],
  imports: [
   
    InventoryRoutingModule,
    CommonModule,
    SharedModule,
    
    
  ],
  providers: [
  
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    // PipesModule
    
   
  ],
})
export class InventoryModule { }
