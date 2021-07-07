import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgxMaskModule } from 'ngx-mask';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { CustomValidators } from 'src/app/common/custom-validators';


@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ApplicationPipesModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(),
    MatProgressSpinnerModule,
  ],
  declarations: [
    SettingsComponent,
  ],
  providers: [
    CustomValidators,
  ],
})
export class SettingsModule { }
