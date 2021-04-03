import { ContactMainviewComponent } from './contact-mainview/contact-mainview.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
   
    { path: '', component: ContactMainviewComponent },


      
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ContactRoutingModule {}