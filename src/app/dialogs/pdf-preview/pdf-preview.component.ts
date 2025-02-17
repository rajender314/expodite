import { OrdersComponent } from './../../orders-module/orders/orders.component';
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var App: any;
@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.css']
})
export class PdfPreviewComponent implements OnInit {
  public zoom_to: number = 1;
  public inProcess: boolean = true;
  public isScroll: boolean = false;
  public rotation = 0;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    // console.log(this.data.link_url)
    // if(this.data.link_url.lastindexOf('.doc') > -1 || this.data.link_url.lastindexOf('.docx') > -1 || this.data.link_url.lastindexOf('.xlsx') > -1) {
      setTimeout(() => {
        this.inProcess = false;
      }, 20);
    // }
    
  };
  pageRendered(e: CustomEvent) {
    this.inProcess = false;
    // console.log('(page-rendered)', e);
  }
  rotateRight() {
    this.rotation += 90;
  }
  rotateLeft() {
    this.rotation -= 90
  }
  downloadFile() {
		var downloadUrl = App.base_url + 'downloadFile?link_url='+ this.data.link_url + '&original_name=' + this.data.original_name;
        window.open(downloadUrl, '_blank');
		
		
	}
  zoom_in() {
    this.isScroll = true;
    this.zoom_to = this.zoom_to + 0.25;
  }

  zoom_out() {
    if (this.zoom_to > 1) {
       this.zoom_to = this.zoom_to - 0.25;
       this.isScroll = true;
    } else {
      this.isScroll = false;
    }
  }
  closePreview() {
    this.dialogRef.close();
  }

}
