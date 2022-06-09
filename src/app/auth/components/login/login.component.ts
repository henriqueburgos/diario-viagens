import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoginProvidersComponent } from '../login-providers/login-providers/login-providers.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: HotToastService,
    private dialog : MatDialog,
  ) {}

  onSubmit() {
    const { email, senha } = this.loginForm.value;
    this.authService
      .loginEmail(email, senha)
      .pipe(
        this.toast.observe({
          success: 'Login efetuado',
          error: 'Um erro ocorreu',
          loading: 'Fazendo login...',
        })
      )
      .subscribe();
  }


  onClickDialog(){
         this.dialog.open(LoginProvidersComponent);
    }
  
  ngOnInit(): void { }
}
