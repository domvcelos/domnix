import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SidebarModule } from '../components/sidebar/sidebar.module';
import { FullPageComponent } from './full-page/full-page.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { HeaderModule } from '../components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forChild([]),
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    HeaderModule,
    SidebarModule
  ],
  exports: [MainLayoutComponent, FullPageComponent],
  declarations: [MainLayoutComponent, FullPageComponent],
})
export class LayoutModule {}
