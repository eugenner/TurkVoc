import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TSymbolsComponent } from './t-symbols.component';

describe('TSymbolsComponent', () => {
  let component: TSymbolsComponent;
  let fixture: ComponentFixture<TSymbolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TSymbolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TSymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
