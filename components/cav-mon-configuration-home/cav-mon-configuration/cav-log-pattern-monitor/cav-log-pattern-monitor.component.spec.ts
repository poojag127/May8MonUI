import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavLogPatternMonitorComponent } from './cav-log-pattern-monitor.component';

describe('CavCheckMonitorComponent', () => {
  let component: CavLogPatternMonitorComponent;
  let fixture: ComponentFixture<CavLogPatternMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavLogPatternMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavLogPatternMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});