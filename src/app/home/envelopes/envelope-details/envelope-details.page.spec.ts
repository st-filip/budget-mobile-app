import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvelopeDetailsPage } from './envelope-details.page';

describe('EnvelopeDetailsPage', () => {
  let component: EnvelopeDetailsPage;
  let fixture: ComponentFixture<EnvelopeDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvelopeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
