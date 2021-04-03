import { Component, OnInit,Inject } from '@angular/core';
import { LeadsService } from '../leads.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Images } from '../../images/images.module';
import { MatDialog } from '@angular/material/dialog';
import { QuoteEmailComponent } from '../quote-email/quote-email.component';
declare var App: any;

@Component({
  selector: 'app-quote-preview',
  templateUrl: './quote-preview.component.html',
  styleUrls: ['./quote-preview.component.scss']
})
export class QuotePreviewComponent implements OnInit {
	public images = Images;
  previewData:any;
  previewProducts:any;
  constructor(private dialogRef: MatDialogRef<QuotePreviewComponent>,private service: LeadsService,@Inject(MAT_DIALOG_DATA) private data: any,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getQuotePreview(this.data.data)
    console.log(this.data.data)
  }
  
  getQuotePreview(param: any): void {
   
    this.service
      .getQuotePreview(this.data.data)
      .then(response => {   
        if(response.result.success){
          console.log(response.result.data)
          this.previewData = response.result.data
          this.previewProducts = this.previewData.products
        }
       
      })
      .catch(error => console.log(error))
  }
 urApi = App.api_url
 public ur =this.urApi
  emailQuote(data = {}) {
    this.dialogRef.close();
    let param =[]
    let dialogRef = this.dialog.open(QuoteEmailComponent, {
      panelClass: 'alert-dialog',
      width: '1250px',
      data: {
        email: this.previewData.email,
        pdffile:this.previewData.file_name,
        id:this.previewData.id,
        products:this.previewData.products,
        user:this.previewData.username
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
      }
    });
  }
  backQuote(){
    this.dialogRef.close();
  }
}
