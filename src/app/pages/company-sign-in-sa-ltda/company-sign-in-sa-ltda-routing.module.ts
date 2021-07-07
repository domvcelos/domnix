import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullPageComponent } from 'src/app/layout/full-page/full-page.component';
import { CompanySignInSaLtdaComponent } from './company-sign-in-sa-ltda.component';

const routes: Routes = [
  {
    path: 'cadastrar-empresa-sa-ltda',
    component: FullPageComponent,
    children: [
      { path: '', component: CompanySignInSaLtdaComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanySignInSaLtdaRoutingModule { }
