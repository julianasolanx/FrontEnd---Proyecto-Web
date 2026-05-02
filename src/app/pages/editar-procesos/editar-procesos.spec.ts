import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProcesos } from './editar-procesos';

describe('EditarProcesos', () => {
  let component: EditarProcesos;
  let fixture: ComponentFixture<EditarProcesos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProcesos],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarProcesos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
