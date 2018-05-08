import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonProfilesComponent } from './cav-mon-profiles.component';

describe('CavMonProfilesComponent', () => {
  let component: CavMonProfilesComponent;
  let fixture: ComponentFixture<CavMonProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
