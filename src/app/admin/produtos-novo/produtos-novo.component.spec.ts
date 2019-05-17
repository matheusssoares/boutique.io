import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosNovoComponent } from './produtos-novo.component';

describe('ProdutosNovoComponent', () => {
  let component: ProdutosNovoComponent;
  let fixture: ComponentFixture<ProdutosNovoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdutosNovoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutosNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
