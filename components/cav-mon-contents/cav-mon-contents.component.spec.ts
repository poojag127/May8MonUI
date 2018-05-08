import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonContentsComponent } from './cav-mon-contents.component';

describe('CavMonContentsComponent', () => {
  let component: CavMonContentsComponent;
  let fixture: ComponentFixture<CavMonContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
