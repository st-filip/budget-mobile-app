import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnvelopeTransactionElementComponent } from './envelope-transaction-element.component';

describe('EnvelopeTransactionElementComponent', () => {
  let component: EnvelopeTransactionElementComponent;
  let fixture: ComponentFixture<EnvelopeTransactionElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvelopeTransactionElementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnvelopeTransactionElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
