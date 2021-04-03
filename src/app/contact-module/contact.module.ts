import { ContactMainviewComponent } from './contact-mainview/contact-mainview.component';
import { AddContactComponent } from './../dialogs/add-contact/add-contact.component';
import { ContactRoutingModule } from './contact-routing.module';
import { SharedModule } from './../shared/shared.module';

import { NgModule } from '@angular/core';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './../services/http-interceptor.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
      suppressScrollX: true
    };
     

@NgModule({
  declarations: [ 
    ContactMainviewComponent,
    AddContactComponent
    
  ],
  imports: [
   
    ContactRoutingModule,
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
export class ContactModule { }
