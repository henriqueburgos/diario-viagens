import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  CheckboxRequiredValidator,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TermosDePrivacidadeComponent } from 'src/app/shared/components/termos-de-privacidade/termos-de-privacidade.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {
  hide = true;
  signupForm = this.fb.group(
    {
      nome: ['', [Validators.required]],
      nick: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirma_senha: [''],
      checkbox: [false, [Validators.requiredTrue]],
    },
    { validators: [this.matchPasswords] }
  );

  matchPasswords(control: AbstractControl): ValidationErrors | null {
    return control.get('senha')!.value !== control.get('confirma_senha')!.value
      ? { matchPasswords: true }
      : null;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: HotToastService,
    private dialog: MatDialog
  ) {}

  onSubmit() {
    const { email, senha, nick, nome } = this.signupForm.value;
    this.authService
      .signupEmail(email, senha, nome, nick)
      .pipe(
        this.toast.observe({
          success: 'Usuário criado com sucesso',
          error: 'Um erro ocorreu',
          loading: 'Criando usuário...',
        })
      )
      .subscribe();
  }

  onLoginGoogle() {
    this.authService
      .loginGoogle()
      .pipe(
        this.toast.observe({
          success: 'Login efetuado',
          error: 'Operação cancelada',
          loading: 'Fazendo login...',
        })
      )
      .subscribe();
  }

  onClickDialogTermosDePrivacidade() {
    this.dialog.open(TermosDePrivacidadeComponent);
  }
  ngOnInit(): void {}
}
