import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDiscoveryComponent } from './job-discovery.component';

describe('JobDiscoveryComponent', () => {
  let component: JobDiscoveryComponent;
  let fixture: ComponentFixture<JobDiscoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDiscoveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
