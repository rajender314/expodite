import { Component, OnInit } from '@angular/core';
import { AdminService } from './../../services/admin.service';
import { Router, ActivatedRoute,Params, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { SnakbarService } from '../../services/snakbar.service';


@Component({
  selector: 'app-authorize-mail',
  templateUrl: './authorize-mail.component.html',
  styleUrls: ['./authorize-mail.component.scss']
})
export class AuthorizeMailComponent implements OnInit {
  url: any;
  fetchingData: boolean;
	public selectedId : any;
  public getUrl : any;
  code: any;
  public authorize: boolean = false;
  public reAuthorize:boolean = false;
  authorized: boolean;
  constructor(private adminService: AdminService,
  	public router: Router,
    public activatedRoute: ActivatedRoute,
		private snackbar: SnakbarService
    ) {
      this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
    });
  }

  ngOnInit() {
    this.getAuthorizeMail()
    if(this.code) {
      this.getAuthUrl();
    }
  }

  getAuthorizeMail(): void {
    this.fetchingData = true;
    this.adminService
      .getAuthrozemail()
      .then(response => {
        if (response.result.success) {
          this.fetchingData = false;
          this.url = response.result.data.redirect_url;
          this.authorized = response.result.data.authorized
        }
      })
      .catch(error => console.log(error))
  }

  getAuthUrl(): void {
    this.fetchingData = true;
    let param = {
      code : this.code
    }
    this.adminService
      .getAuthUser(param)
      .then(response => {
        if (response.result.success) {
          let toast: object;
					toast = { msg: 'You are successfully Authorized.', status: "success" };
					this.snackbar.showSnackBar(toast);
        } else {
          let toast: object;
					toast = { msg: 'Authorization failure.', status: "error" };
					this.snackbar.showSnackBar(toast);
        }
      })
      .catch(error => console.log(error))
  }

  authorizeData() {
    this.reAuthorize = true;
    let toast: object;
		toast = { msg: 'You are already Authorized.', status: "success" };
		this.snackbar.showSnackBar(toast);
  }

}
