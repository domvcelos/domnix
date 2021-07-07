import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullPageComponent } from 'src/app/layout/full-page/full-page.component';
import { SelectEstablishmentTypeComponent } from './select-establishment-type.component';


const routes: Routes = [
  {
    path: 'selecionar-tipo',
    component: FullPageComponent,
    children: [
      { path: '', component: SelectEstablishmentTypeComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectEstablishmentTypeRoutingModule { }
