import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActionBarComponent } from './action-bar.component';
@NgModule({
  imports: [CommonModule],
  exports: [ActionBarComponent],
  declarations: [
    ActionBarComponent
  ],
})
export class ActionBarModule {}
