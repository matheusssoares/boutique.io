import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovCaixaComponent } from './mov-caixa.component';

describe('MovCaixaComponent', () => {
  let component: MovCaixaComponent;
  let fixture: ComponentFixture<MovCaixaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovCaixaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
