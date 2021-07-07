import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AvatarModule } from 'ngx-avatar';

import { SidebarModule } from '../sidebar/sidebar.module';
import { HeaderComponent } from './header.component';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { CustomValidators } from 'src/app/common/custom-validators';
import { SupportModalComponent } from './components/support-modal/support-modal.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SidebarModule,
    MatMenuModule,
    BrowserModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    MatSelectModule
  ],
  exports: [HeaderComponent],
  declarations: [HeaderComponent, ChangePasswordModalComponent, SupportModalComponent],
  providers: [CustomValidators]
})
export class HeaderModule { }
