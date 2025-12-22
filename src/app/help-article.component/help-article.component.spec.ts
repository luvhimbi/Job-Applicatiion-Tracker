import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpArticleComponent } from './help-article.component';

describe('HelpArticleComponent', () => {
  let component: HelpArticleComponent;
  let fixture: ComponentFixture<HelpArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
