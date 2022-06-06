import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProvidersComponent } from './login-providers.component';

describe('LoginProvidersComponent', () => {
  let component: LoginProvidersComponent;
  let fixture: ComponentFixture<LoginProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
