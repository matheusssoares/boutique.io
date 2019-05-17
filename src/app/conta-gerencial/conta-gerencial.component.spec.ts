import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaGerencialComponent } from './conta-gerencial.component';

describe('ContaGerencialComponent', () => {
  let component: ContaGerencialComponent;
  let fixture: ComponentFixture<ContaGerencialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaGerencialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaGerencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
