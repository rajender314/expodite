import { Routes } from '@angular/router';

import { UsersComponent } from '../../users/users.component';

declare var App: any;
export const UsersRoutes: Routes = [
    
];
App.user_roles_permissions.map(function(value){
    switch(value.code){
        case "users":
        if(value.selected){
          UsersRoutes.push({ path: '', redirectTo: '/users', pathMatch: 'full' });
          UsersRoutes.push({ path: 'users', component: UsersComponent });
        }
        break;
    }
}); 