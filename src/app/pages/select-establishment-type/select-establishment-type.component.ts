import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanySignInService } from '../company-sign-in-sa-ltda/shared/company-sign-in.service';
import { COMPANYTYPES_ALL } from '../company-sign-in-sa-ltda/shared/mock-company-sign-in-sa-ltda';



@Component({
  selector: 'app-login',
  templateUrl: './select-establishment-type.component.html',
  styleUrls: ['./select-establishment-type.component.scss'],
})
export class SelectEstablishmentTypeComponent implements OnInit {
  public logo = 'nix-empresas-logo-black';
  public establishmentTypes = COMPANYTYPES_ALL;
  public selectedType = this.establishmentTypes[0].value;
  constructor(
    private router: Router,
    private companySignInService: CompanySignInService

  ) {

  }

  ngOnInit(): void {}

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  next(): void {
      if (this.selectedType === 'SA' || this.selectedType === 'LTDA') {
        this.companySignInService.typePage = this.selectedType;
        this.navigateTo('/cadastrar-empresa-sa-ltda');
      }else{
        this.navigateTo('/abrir-conta');
      }
  }
}
