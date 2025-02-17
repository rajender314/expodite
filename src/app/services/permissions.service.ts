import { Injectable } from '@angular/core';

import * as _ from 'lodash';

declare var App: any;

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor() { }

  private permissions = App.role_permissions;

  check(code, permId): boolean{
    let index;

    index = _.findIndex(this.permissions, {code: code});
    if(index === -1) return false;
    if(_.indexOf(this.permissions[index].permission, permId) === -1) return false;
    
    return true;
  }

  getPermission(code): any{
    let obj = _.find(this.permissions, {code: code});

    if(obj && obj.permission) return obj.permission;
    else return [];
  }

}
