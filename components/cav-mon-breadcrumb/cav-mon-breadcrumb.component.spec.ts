import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonBreadcrumbComponent } from './cav-mon-breadcrumb.component';

describe('CavMonBreadcrumbComponent', () => {
  let component: CavMonBreadcrumbComponent;
  let fixture: ComponentFixture<CavMonBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
