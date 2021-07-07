import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/common/services/authentication/auth.service';


@Component({
  selector: 'app-accept-terms',
  templateUrl: './accept-terms.component.html',
  styleUrls: ['./accept-terms.component.scss'],
})
export class AcceptTermsComponent implements OnInit {
  isEnable = true;
  isChecked = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      acceptTerms: [{ value: false, disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void { }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
    // visible height + pixel scrolled >= total height
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      this.isEnable = false;
      this.form.get('acceptTerms').enable();
    }
  }

  accept(): void {
    this.router.navigateByUrl('/cadastrar-empresa');
  }

  logout(): void {
    this.authService.logout();
  }

}
