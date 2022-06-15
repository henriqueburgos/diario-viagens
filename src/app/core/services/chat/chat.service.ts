
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { addDoc, collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { MensagemConveter, Mensagem } from '../../models/Mensagem';
import { UploadService } from '../upload/upload.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private fireDb: Firestore,
    private authService: AuthService,
  ) { }

  mensagem = collection(this.fireDb, 'menssages').withConverter(MensagemConveter);

  enviarMensagem(infoMensagem: Mensagem, imagem?: string) {

    return this.authService.userData.pipe(
      switchMap((user) => {
        infoMensagem.createAt = new Date();
        infoMensagem.photoURL = imagem ?? 'https://jsl-online.com/wp-content/uploads/2017/01/placeholder-user.png'
        infoMensagem.usuarioId = this.authService.uid;
        infoMensagem.usuarioName = user['nome'];
        return from(addDoc(this.mensagem, infoMensagem));
      })
    )
  }

  getMesagens(): Observable<Mensagem[]> {
    return collectionData(query(this.mensagem, orderBy("createAt")), { idField: 'id' });
  }

}
