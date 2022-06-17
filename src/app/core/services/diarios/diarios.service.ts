import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import {
  collectionData,
  docData,
  Firestore,
  orderBy,
  where,
} from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
} from '@firebase/firestore';
import { HotToastService } from '@ngneat/hot-toast';
import { first, from, Observable, switchMap } from 'rxjs';
import { Diario, DiarioConverter } from '../../models/diario';
import { AuthService } from '../auth/auth.service';
import { UploadService } from '../upload/upload.service';

@Injectable({
  providedIn: 'root',
})
export class DiariosService {
  constructor(
    private db: Firestore,
    private authService: AuthService,
    private uploadService: UploadService,
    private toast: HotToastService,
  ) { }

  diarios = collection(this.db, 'diarios').withConverter(DiarioConverter);
  curtido?: boolean;

  getTodosDiarios(): Observable<Diario[]> {

    return collectionData(query(this.diarios, orderBy("createdAt", 'desc')), { idField: 'id' });
  }

  getDiariosUsuario(): Observable<Diario[]> {
    return this.authService.logged.pipe(

      first(),
      switchMap((user) => {

        return collectionData(
          query(this.diarios, where('usuarioId', '==', user?.uid)),
          { idField: 'id' }
        );
      })
    );
  }

  getDiarioById(id: string): Observable<Diario> {
    const diarioDoc = doc(this.diarios, id);
    return docData(diarioDoc, { idField: 'id' });
  }

  addDiario(diario: Diario, imagem?: File) {

    return this.authService.userData.pipe(
      // (1)
      switchMap((user) => {
        return this.uploadService
          .upload(imagem, `diarios/${this.authService.uid}/`)
          .pipe(
            switchMap((url) => {
              diario.createdAt = new Date();
              diario.updateAT = new Date();
              diario.imagem = url ?? 'assets/img/placeholder.png';
              diario.usuarioId = this.authService.uid;
              diario.usuarioNick = user['nick'];
              diario.usuarioName = user['nome'];
              diario.views = 0;
              diario.likes = [];
              diario.likesNumber=0;

              return from(addDoc(this.diarios, diario));
            })
          );
      })
    );
  }

  editDiario(diario: Diario, imagem?: File) {
    const diarioDoc = doc(this.diarios, diario.id);
    return this.uploadService
      .upload(imagem, `diarios/${diario.usuarioId}/`)
      .pipe(
        switchMap((url) => {

          return from(
            updateDoc(diarioDoc, { ...diario, imagem: url ?? diario.imagem, updateAT: new Date() })
          );
        })
      );
  }

  diarioView(diario: Diario) {
    const diarioDoc = doc(this.diarios, diario.id);
    diario.views++

    return from(updateDoc(diarioDoc, { ...diario, views: diario.views }))

  }
  likeDiario(diario: Diario) {
    const diarioDoc = doc(this.diarios, diario.id);
    const user = this.authService.uid
    if (user) {
      diario.likes.push(user)
      diario.likesNumber=diario.likes.length
    
    }
    return from(updateDoc(diarioDoc, { ...diario, likes: diario.likes, likesNumber: diario.likesNumber,dLikeUid: diario.dLikeUid }))
  }
  dislikeDiario(diario: Diario) {
    const diarioDoc = doc(this.diarios, diario.id);
    const user = this.authService.uid
    if (user) {
      console.log(diario.likes.indexOf(user));
      let local = diario.likes.indexOf(user);
      diario.likes.splice(local, 1);
      diario.likesNumber=diario.likes.length
          
    }
    return from(updateDoc(diarioDoc, { ...diario, likes: diario.likes, likesNumber: diario.likesNumber,dLikeUid: diario.dLikeUid}))
  }


allreadyLike(diario: Diario) {
   const user = this.authService.uid
  if (user) {
    let verifica = diario.likes.includes(user)
    console.log(verifica)
    if (verifica) {
      console.log("usuario já curtido, descurtindo")
      this.dislikeDiario(diario)
      verifica = diario.likes.includes(user)
      console.log(verifica)
      this.toast.warning("diario descurtido")
    } else {
     this.likeDiario(diario)
     this.toast.success("diario Curtido")
    }
  }}


deleteDiario(diario: Diario) {

  const diarioDoc = doc(this.diarios, diario.id);

  return from(deleteDoc(diarioDoc));
}
}
