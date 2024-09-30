import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogLogoutComponent } from './confirm-dialog-logout.component';

describe('ConfirmDialogLogoutComponent', () => {
  let component: ConfirmDialogLogoutComponent;
  let fixture: ComponentFixture<ConfirmDialogLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogLogoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmDialogLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
