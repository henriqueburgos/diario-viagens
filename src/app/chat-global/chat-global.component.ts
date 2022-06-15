import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth/auth.service';
import { ChatService } from '../core/services/chat/chat.service';
import { Mensagem } from '../core/models/Mensagem';
import { Observable } from 'rxjs';
import { UserService } from '../core/services/user/user.service';

@Component({
  selector: 'app-chat-global',
  templateUrl: './chat-global.component.html',
  styleUrls: ['./chat-global.component.scss']
})
export class ChatGlobalComponent implements OnInit {

  allMensages$?: Observable<Mensagem[]>;
  userPhoto!: any;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
    ) { }

    formChat = this.fb.group({
    mensagem: ['', [Validators.required]]
  })

  usuarioId(mensagem: Mensagem) {
    return mensagem.usuarioId === this.authService.uid;
  }

  enviarMensagem() {
    const { mensagem } = this.formChat.value;
    this.chatService.enviarMensagem({mensagem} as Mensagem, this.userPhoto)
    .subscribe((res) => {
      console.log(res);
      this.formChat.reset()
    });
  }

  ngOnInit(): void {
    this.allMensages$ = this.chatService.getMesagens();

    this.userService.currentProfile$.subscribe(res => {
      this.userPhoto = res?.photoURL;
    })
  }

}
