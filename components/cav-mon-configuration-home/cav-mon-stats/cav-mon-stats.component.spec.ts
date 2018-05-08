import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonStatsComponent } from './cav-mon-stats.component';

describe('CavMonStatsComponent', () => {
  let component: CavMonStatsComponent;
  let fixture: ComponentFixture<CavMonStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
