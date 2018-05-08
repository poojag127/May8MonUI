import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavServerSignatureComponent } from './cav-server-signature.component';

describe('CavCheckMonitorComponent', () => {
  let component: CavServerSignatureComponent;
  let fixture: ComponentFixture<CavServerSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavServerSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavServerSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});