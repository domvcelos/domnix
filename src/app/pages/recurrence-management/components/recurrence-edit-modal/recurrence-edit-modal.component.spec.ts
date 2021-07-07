import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { RecurrenceEditModalComponent } from './recurrence-edit-modal.component';


describe('RecurrenceEditModalComponent', () => {
  let component: RecurrenceEditModalComponent;
  let fixture: ComponentFixture<RecurrenceEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
        ApplicationPipesModule,
      ],
      declarations: [RecurrenceEditModalComponent],
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
    fixture = TestBed.createComponent(RecurrenceEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
