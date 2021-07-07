import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ManagePlansService } from '../manage-plans/shared/manage-plans.service';
import { IPlan } from '../manage-plans/shared/plan.model';


@Component({
  selector: 'app-manage-companies',
  templateUrl: './manage-companies.component.html',
  styleUrls: ['./manage-companies.component.scss']
})
export class ManageCompaniesComponent implements OnInit {

  loading = false;
  company: any;
  plan: any;
  plans: IPlan[];
  companies: any;

  constructor(
    private managePlansService: ManagePlansService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.loadPlans();
    this.loadCompanies();
  }

  ngOnInit(): void {
  }

  loadPlans(): void {
    this.loading = true;
    this.managePlansService.getMyPlans().subscribe(
      PLANS => {
        this.plans = PLANS.results;
      },
      ERROR => this.toastr.error('Não foi possível obter planos.'),
    ).add(() => this.loading = false);
  }

  loadCompanies(): void {
    this.loading = true;
    this.managePlansService.getMyCompanies().subscribe(
      COMPANIES => {
        this.companies = COMPANIES.results;
      },
      ERROR => this.toastr.error('Não foi possível obter lista de empresas.'),
    ).add(() => this.loading = false);
  }

  goToCompany(): void {
    if (!this.company) {
      this.toastr.warning('Selecione uma empresa.');
    }
  }

  goToPlan(): void {
    if (this.plans.length < 1) {
      this.router.navigateByUrl('plano');
    } else if (!this.plan) {
      this.toastr.warning('Selecione um plano.');
    } else {
      this.managePlansService.selectedPlan = this.plan;
      this.router.navigateByUrl('planos');
    }
  }

  newPlan(): void {
    this.router.navigateByUrl('plano');
  }

}
