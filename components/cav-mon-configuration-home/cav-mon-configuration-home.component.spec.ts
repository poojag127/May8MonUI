import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonConfigurationHomeComponent } from './cav-mon-configuration-home.component';

describe('CavMonConfigurationHomeComponent', () => {
  let component: CavMonConfigurationHomeComponent;
  let fixture: ComponentFixture<CavMonConfigurationHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonConfigurationHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonConfigurationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
