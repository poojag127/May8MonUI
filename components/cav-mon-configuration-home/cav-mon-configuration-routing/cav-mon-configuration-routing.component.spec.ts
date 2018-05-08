import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonConfigurationRoutingComponent } from './cav-mon-configuration-routing.component';

describe('CavMonConfigurationRoutingComponent', () => {
  let component: CavMonConfigurationRoutingComponent;
  let fixture: ComponentFixture<CavMonConfigurationRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonConfigurationRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonConfigurationRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
