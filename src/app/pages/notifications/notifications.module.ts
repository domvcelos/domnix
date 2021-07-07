import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { CustomValidators } from 'src/app/common/custom-validators';
import { NotificationInfoModalComponent } from './components/notification-info-modal/notification-info-modal.component';
import { ConfigNotificationModalComponent } from './components/config-notification-modal/config-notification-modal.component';


@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationInfoModalComponent,
    ConfigNotificationModalComponent,
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressAnimation: 'decreasing',
      progressBar: true,
      closeButton: true,
    }),
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    ActionBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogModule,
    NgxCurrencyModule,
    MatMenuModule,
    MatCheckboxModule,
    ApplicationPipesModule,
    NgxMaskModule.forRoot(),
    MatSlideToggleModule,
  ],
  providers: [
    CustomValidators
  ],
})
export class NotificationsModule { }
