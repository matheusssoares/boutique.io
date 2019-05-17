import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueBaixoComponent } from './estoque-baixo.component';

describe('EstoqueBaixoComponent', () => {
  let component: EstoqueBaixoComponent;
  let fixture: ComponentFixture<EstoqueBaixoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstoqueBaixoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstoqueBaixoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
