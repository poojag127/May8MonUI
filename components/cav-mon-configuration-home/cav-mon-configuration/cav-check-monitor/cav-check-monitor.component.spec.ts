import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavCheckMonitorComponent } from './cav-check-monitor.component';

describe('CavCheckMonitorComponent', () => {
  let component: CavCheckMonitorComponent;
  let fixture: ComponentFixture<CavCheckMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavCheckMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavCheckMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});