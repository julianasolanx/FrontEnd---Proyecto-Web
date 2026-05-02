import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeladorProceso } from './modelador-proceso';

describe('ModeladorProceso', () => {
  let component: ModeladorProceso;
  let fixture: ComponentFixture<ModeladorProceso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeladorProceso],
    }).compileComponents();

    fixture = TestBed.createComponent(ModeladorProceso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
