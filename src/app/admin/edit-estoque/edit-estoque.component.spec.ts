import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEstoqueComponent } from './edit-estoque.component';

describe('EditEstoqueComponent', () => {
  let component: EditEstoqueComponent;
  let fixture: ComponentFixture<EditEstoqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEstoqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
