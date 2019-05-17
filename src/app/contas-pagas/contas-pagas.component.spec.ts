import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasPagasComponent } from './contas-pagas.component';

describe('ContasPagasComponent', () => {
  let component: ContasPagasComponent;
  let fixture: ComponentFixture<ContasPagasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContasPagasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContasPagasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
