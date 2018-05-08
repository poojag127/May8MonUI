import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonConfigurationComponent } from './cav-mon-configuration.component';

describe('CavMonConfigurationComponent', () => {
  let component: CavMonConfigurationComponent;
  let fixture: ComponentFixture<CavMonConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
