import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonDynamicDependentCompComponent } from './cav-mon-dynamic-dependent-comp.component';

describe('CavMonDynamicDependentCompComponent', () => {
  let component: CavMonDynamicDependentCompComponent;
  let fixture: ComponentFixture<CavMonDynamicDependentCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonDynamicDependentCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonDynamicDependentCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
