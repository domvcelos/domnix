import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { ToastrModule } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';

import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { RecurrencePlanComponent } from './recurrence-plan.component';


describe('RecurrencePlanComponent', () => {
  let component: RecurrencePlanComponent;
  let fixture: ComponentFixture<RecurrencePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
        ApplicationPipesModule,
        HttpClientModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: 'Novo usuário',
        },
        Utils,
      ],
      declarations: [RecurrencePlanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurrencePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
