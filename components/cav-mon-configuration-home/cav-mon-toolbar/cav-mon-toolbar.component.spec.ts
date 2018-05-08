import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonToolbarComponent } from './cav-mon-toolbar.component';

describe('CavMonToolbarComponent', () => {
  let component: CavMonToolbarComponent;
  let fixture: ComponentFixture<CavMonToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
