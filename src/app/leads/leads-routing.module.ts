import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { LeadOverviewComponent } from './lead-overview/lead-overview.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  { path: '', component: LeadsListComponent },
  {
    path: 'details/:id',
    component: LeadDetailsComponent,
    children: [
      {
        path: '',
        component: LeadOverviewComponent
      },
      {
        path: 'messages',
        component: MessagesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
