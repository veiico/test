import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwGoogleAutocompleteComponent } from './components/autocomplete/jw-google-autocomplete.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { JwGoogleAutocompleteService } from './service/jw-google-autocomplete.service';
import { RouterModule } from '@angular/router';
// import { GoogleMapsConfig } from '../../services/googleConfig';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  declarations: [JwGoogleAutocompleteComponent],
  providers: [
    JwGoogleAutocompleteService,
    // GoogleMapsConfig
  ],
  exports: [JwGoogleAutocompleteComponent]
})
export class JwGoogleAutocompleteModule { }
