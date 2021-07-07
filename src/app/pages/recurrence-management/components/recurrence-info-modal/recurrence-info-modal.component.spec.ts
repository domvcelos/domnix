import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';

import { RecurrenceInfoModalComponent } from './recurrence-info-modal.component';

describe('RecurrenceInfoModalComponent', () => {
  let component: RecurrenceInfoModalComponent;
  let fixture: ComponentFixture<RecurrenceInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
        ApplicationPipesModule,
      ],
      declarations: [RecurrenceInfoModalComponent],
      providers: [
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: 'Novo usuário',
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurrenceInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
