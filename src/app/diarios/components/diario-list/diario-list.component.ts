import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { map, Observable } from 'rxjs';
import { Diario } from 'src/app/core/models/diario';
import { DiariosService } from 'src/app/core/services/diarios/diarios.service';
import { DiarioAddComponent } from '../diario-add/diario-add.component';
import { DiarioEditComponent } from '../diario-edit/diario-edit.component';
import { UserService } from 'src/app/core/services/user/user.service';
import { DiarioDeleteComponent } from '../diario-delete/diario-delete.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChatGlobalComponent } from 'src/app/chat-global/chat-global.component';
import { Mensagem } from 'src/app/core/models/Mensagem';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-diario-list',
  templateUrl: './diario-list.component.html',
  styleUrls: ['./diario-list.component.scss',],
})
export class DiarioListComponent implements OnInit {

  totalMensagens$?: Observable<number>;

  allDiarios$?: Observable<Diario[]>;
  meusDiarios$?: Observable<Diario[]>;
  userPhoto!: any;
  p: number = 1
  p2:number=1
  uidLogado?:string;

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  constructor(
    private dialog: MatDialog,
    private diariosService: DiariosService,
    private toast: HotToastService,
    private userService: UserService,
    private breakpointObserve: BreakpointObserver,
    private chatService: ChatService,
    private auth:AuthService,
  ) { }

  responsivo = this.breakpointObserve.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ]).pipe(
    map((matches: BreakpointState) => {
      if (matches.breakpoints[Breakpoints.XSmall]) {
        console.log("estou no xsmall")
        return [

          { colunas: 2, linhas: 1, },
        ]
      }
      if (matches.breakpoints[Breakpoints.Small]) {
        console.log("estou no small")
        return [
          { colunas: 2, linhas: 1, },
        ]
      }
      if (matches.breakpoints[Breakpoints.Medium]) {
        console.log("estou no medium")
        return [
          { colunas: 2, linhas: 1, },
        ]
      }
      console.log("estou no small")
      return [
        { colunas: 1, linhas: 1, },
      ]
    })
  );

  onClickAdd() {
    const ref = this.dialog.open(DiarioAddComponent, { maxWidth: '512px' });
    ref.afterClosed().subscribe({
      next: (result) => {

        if (result) {
          this.diariosService
            .addDiario(result.diario, result.imagem)
            .pipe(
              this.toast.observe({
                loading: 'Adicionando...',
                error: 'Ocorreu um erro',
                success: 'Diário adicionado',
              })
            )
            .subscribe();
        }
      },
    });
  }

  openChat() {
    const ref = this.dialog.open(ChatGlobalComponent, { maxWidth: '512px' });
  }

  onClickEdit(diario: Diario) {
    const ref = this.dialog.open(DiarioEditComponent, {
      maxWidth: '512px',
      data: { ...diario },
    });
    ref.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.diariosService
            .editDiario(result.diario, result.imagem)
            .pipe(
              this.toast.observe({
                loading: 'Atualizando...',
                error: 'Ocorreu um erro',
                success: 'Diário atualizado',
              })
            )
            .subscribe();
        }
      },
    });
  }

  onClickDelete(diario: Diario) {
    const apagar = this.dialog.open(DiarioDeleteComponent);
    apagar.afterClosed().subscribe(result => {
      if (result) {
        this.diariosService
          .deleteDiario(diario)
          .pipe(this.toast.observe({ success: 'Diário apagado!' }))
          .subscribe();
      }
    })
  }
  changeImageProfile() {
    let photo = document.querySelector('.photoDiarioStyle');
    let photoTwo = document.querySelector('.example-image');
    if (this.userPhoto) {
      photo?.classList.remove('photoDiarioStyle');
      photoTwo?.classList.remove('example-image');
      photo?.setAttribute('id', 'photoTemp');
    }
  }

  onClickView(diario: Diario) {
    this.diariosService.diarioView(diario).subscribe();
  }
  onClickLike(diario: Diario) {
    this.diariosService.allreadyLike(diario)
  }

  ngOnInit(): void {
    this.allDiarios$ = this.diariosService.getTodosDiarios();
    this.meusDiarios$ = this.diariosService.getDiariosUsuario();
    this.uidLogado = this.auth.uid
    this.userService.currentProfile$.subscribe(res => {
      this.userPhoto = res?.photoURL
      this.changeImageProfile();
    })


    this.totalMensagens$ = this.chatService.getMesagens().pipe(map((res) => {
      return res.length
    }))


  }
}
