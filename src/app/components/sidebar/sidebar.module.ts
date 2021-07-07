import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [CommonModule, MatExpansionModule],
  exports: [SidebarComponent],
  declarations: [SidebarComponent],
})
export class SidebarModule {}
