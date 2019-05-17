import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFornecedoresComponent } from './edit-fornecedores.component';

describe('EditFornecedoresComponent', () => {
  let component: EditFornecedoresComponent;
  let fixture: ComponentFixture<EditFornecedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFornecedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
