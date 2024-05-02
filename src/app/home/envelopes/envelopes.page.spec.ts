import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvelopesPage } from './envelopes.page';

describe('EnvelopesPage', () => {
  let component: EnvelopesPage;
  let fixture: ComponentFixture<EnvelopesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvelopesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
