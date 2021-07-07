import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullPageComponent } from 'src/app/layout/full-page/full-page.component';
import { UserSignInComponent } from './user-sign-in.component';


const routes: Routes = [
  {
    path: 'abrir-conta',
    component: FullPageComponent,
    children: [
      { path: '', component: UserSignInComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSignInRoutingModule { }
