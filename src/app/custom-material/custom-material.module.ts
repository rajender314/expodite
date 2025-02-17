import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

//import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {MatBadgeModule} from '@angular/material/badge';

declare var App: any;

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MyDateAdapter } from './data-picker/my-date-adapter';

/*const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};*/

@NgModule({
  imports: [
    //FlexLayoutModule,
    MatTabsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatRadioModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTableModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatExpansionModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBadgeModule
  ],
  exports: [
   // FlexLayoutModule,
    MatTabsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatRadioModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTableModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatExpansionModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBadgeModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    //{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class CustomMaterialModule {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'avatar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/user.svg'));
    iconRegistry.addSvgIcon(
      'export',
      sanitizer.bypassSecurityTrustResourceUrl(App.public_url + 'signatures/assets/images/export.svg'));
    iconRegistry.addSvgIcon(
      'campaign',
      sanitizer.bypassSecurityTrustResourceUrl(App.public_url + 'signatures/assets/images/campaign.svg'));
    iconRegistry.addSvgIcon(
      'dashboard',
      sanitizer.bypassSecurityTrustResourceUrl(App.public_url + 'signatures/assets/images/dashboard.svg'));
    iconRegistry.addSvgIcon(
        'users',
      sanitizer.bypassSecurityTrustResourceUrl(App.public_url + 'signatures/assets/images/users.svg'));
  }
}
