import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarProcesos } from './consultar-procesos';

describe('ConsultarProcesos', () => {
  let component: ConsultarProcesos;
  let fixture: ComponentFixture<ConsultarProcesos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarProcesos],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarProcesos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
