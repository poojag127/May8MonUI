import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonDynamicComponentsComponent } from './cav-mon-dynamic-components.component';

describe('CavMonDynamicComponentsComponent', () => {
  let component: CavMonDynamicComponentsComponent;
  let fixture: ComponentFixture<CavMonDynamicComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonDynamicComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonDynamicComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
