import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonHideShowComponent } from './cav-mon-hide-show.component';

describe('CavMonHideShowComponent', () => {
  let component: CavMonHideShowComponent;
  let fixture: ComponentFixture<CavMonHideShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonHideShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonHideShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
