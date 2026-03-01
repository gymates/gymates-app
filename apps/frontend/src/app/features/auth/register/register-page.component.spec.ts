import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import type { components } from '../../../shared/api-types';
import { RegisterComponent } from './register.component';

type RegisterResponse = components['schemas']['RegisterResponse'];

describe('RegisterComponent', () => {
  function create() {
    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideHttpClient(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, comp };
  }

  it('should invalidate when passwords do not match', () => {
    const { comp } = create();
    comp.form.setValue({
      email: 'a@b.com',
      password: 'password1',
      confirmPassword: 'password2',
    });
    expect(comp.form.valid).toBe(false);
    expect(comp.form.controls.confirmPassword.errors?.['mismatch']).toBeTruthy();
  });

  it('should submit on valid form and show success', () => {
    const { comp, fixture } = create();
    const svc = TestBed.inject(AuthService);
    const mock: RegisterResponse = {
      userId: '00000000-0000-0000-0000-000000000000',
      email: 'a@b.com',
      requiresEmailVerification: false,
    };
    jest.spyOn(svc, 'register').mockReturnValue(of(mock));
    comp.form.setValue({
      email: 'a@b.com',
      password: 'password1',
      confirmPassword: 'password1',
    });
    comp.submit();
    expect(svc.register).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'password1',
    });
    expect(comp.isSuccess()).toBe(true);
    fixture.detectChanges();
    const successEl: HTMLElement | null = fixture.nativeElement.querySelector('.status.success');
    expect(successEl).toBeTruthy();
  });

  it('should show error on backend error', () => {
    const { comp, fixture } = create();
    const svc = TestBed.inject(AuthService);
    jest.spyOn(svc, 'register').mockReturnValue(throwError(() => ({ error: { message: 'Email exists' } })));
    comp.form.setValue({
      email: 'a@b.com',
      password: 'password1',
      confirmPassword: 'password1',
    });
    comp.submit();
    expect(comp.isError()).toBe(true);
    expect(comp.isSuccess()).toBe(false);
    fixture.detectChanges();
    const errorEl: HTMLElement | null = fixture.nativeElement.querySelector('.status.error');
    expect(errorEl).toBeTruthy();
  });
});
