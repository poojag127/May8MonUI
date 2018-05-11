import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonHealthCheckComponent } from './cav-mon-health-check.component';

describe('CavMonHideShowComponent', () => {
  let component: CavMonHealthCheckComponent;
  let fixture: ComponentFixture<CavMonHealthCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonHealthCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonHealthCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
