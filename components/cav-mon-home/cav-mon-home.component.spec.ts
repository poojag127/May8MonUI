import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonHomeComponent } from './cav-mon-home.component';

describe('CavMonHomeComponent', () => {
  let component: CavMonHomeComponent;
  let fixture: ComponentFixture<CavMonHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
