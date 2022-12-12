import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOfferFormComponent } from './special-offer-form.component';

describe('SpecialOfferFormComponent', () => {
  let component: SpecialOfferFormComponent;
  let fixture: ComponentFixture<SpecialOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialOfferFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
