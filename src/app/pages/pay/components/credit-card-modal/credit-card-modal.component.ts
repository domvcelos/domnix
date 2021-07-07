import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CustomValidators } from 'src/app/common/custom-validators';

import { Utils } from 'src/app/common/utils';
import {
  IBrand,
  IBrandColorAndLogo,
  IDefaultColorAndBrand,
} from '../../shared/pay.model';
import { PayService } from '../../shared/pay.service';

@Component({
  selector: 'app-credit-card-modal',
  templateUrl: './credit-card-modal.component.html',
  styleUrls: ['./credit-card-modal.component.scss'],
})
export class CreditCardModalComponent implements OnInit {
  loading = false;
  creditCardFormGroup: FormGroup;
  brandLogo = '';
  brandColor = '';
  brandsList: IBrand[];
  @ViewChild('stepper') private stepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private utils: Utils,
    private customValidators: CustomValidators,
    private payService: PayService
  ) {
    this.creditCardFormGroup = this.formBuilder.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      documentValue: [
        '',
        [Validators.required,
        this.customValidators.cpfCnpjValidator()]
      ],
      expDate: ['', [Validators.required, this.customValidators.expireDate]],
      cvv: ['', Validators.required],
      brand: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getValidBrands();
  }

  getBrandByNumber(): void {
    const cardNumber = this.creditCardFormGroup.controls['number'].value;
    const brand = this.utils.getCardFlag(cardNumber);
    this.creditCardFormGroup.patchValue({ brand });
    this.brandColorAndLogo(brand);
  }

  brandColorAndLogo(brand: string): void {
    const bcl = this.getBrandColorAndLogo(brand);
    this.brandColor = bcl.color;
    this.brandLogo = bcl.logo;
  }

  getBrandColorAndLogo(brand: string): IBrandColorAndLogo {
    let logo = this.getDefaultColorAndBrand.brand;
    let color = this.getDefaultColorAndBrand.color;
    this.brandsList.forEach((item) => {
      if (item.value === brand) {
        color = item.color;
        logo = `assets/banks-logo/${item.logo}.png`;
      }
    });
    return { color, logo };
  }

  get getDefaultColorAndBrand(): IDefaultColorAndBrand {
    return { color: '#716b6b', brand: 'none' };
  }

  getValidBrands(): void {
    this.payService
      .getBrands()
      .then((BRANDLIST) => (this.brandsList = BRANDLIST));
  }

  changeBrand(): void {
    this.brandColorAndLogo(this.creditCardFormGroup.controls['brand'].value);
  }

  saveCard(): void {
    if (this.creditCardFormGroup.valid) {
      this.payService.setCurrentCard(this.creditCardFormGroup.value);
      this.stepper.next();
    }
  }
}
