import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOfferManagementComponent } from './special-offer-management.component';

describe('SpecialOfferManagementComponent', () => {
  let component: SpecialOfferManagementComponent;
  let fixture: ComponentFixture<SpecialOfferManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialOfferManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialOfferManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
