import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-login-providers',
  templateUrl: './login-providers.component.html',
  styleUrls: ['./login-providers.component.scss']
})
export class LoginProvidersComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private toast: HotToastService,
    private dialog: MatDialog,
  ) { }

  onLoginGoogle() {
    this.authService
      .loginGoogle()
      .pipe(
        this.toast.observe({
          success: 'Login efetuado com o google',
          error: 'Operação cancelada',
          loading: 'Fazendo login...',
        })
      )
      .subscribe();
      this.dialog.closeAll()
  }
  onLoginFace() {
    this.authService.loginFacebook().pipe(this.toast.observe({
      success: 'Login efetuado com o facebook',
      error: 'Operação cancelada',
      loading: 'Estamos logando iuhul.',
    })
    )
    .subscribe();
    this.dialog.closeAll()
  }

  onLoginGitHub() {
    this.authService.loginGitHub().pipe(this.toast.observe({
      success: 'Login efetuado com o Github',
      error: 'Operação cancelada',
      loading: 'Bem Vindo Dev.',
    })
    )
    .subscribe();
    this.dialog.closeAll()
  }

  closeModal(){
    this.dialog.closeAll()
  }

  ngOnInit(): void {
  }

}
