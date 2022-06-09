import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  doc,
  docData,
  collection,
  Firestore,
  updateDoc,
  collectionData} from '@angular/fire/firestore';
import {
    getDownloadURL,
    ref,
    Storage,
    uploadBytes,
  } from '@angular/fire/storage';
import { updateProfile } from '@firebase/auth';
import { concatMap, from, Observable, of, switchMap } from 'rxjs';
import { InfoUser } from '../../models/infoUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser$ = authState(this.auth);
  usuario!: InfoUser;
  userPhoto!: string;
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  usuarios = collection(this.firestore, 'usuarios');

  addImageUser(img: File, path: string) {
    const reference = ref(this.storage, path);
    const uploadImage = from(uploadBytes(reference, img));
    return uploadImage.pipe(switchMap((res) =>
      getDownloadURL(res.ref)
    ))
   }

   getUsuarios(): Observable<InfoUser[]> {
    return collectionData(this.usuarios, { idField: 'id' });
   }

  updateProfileData(profileData: Partial<InfoUser>): Observable<any> {
    const user = this.auth.currentUser;

    return of(user).pipe(
      concatMap((user) => {
        if (!user) throw new Error('Erro no update');
        return updateProfile(user, profileData);
      })
    );
  }

  get currentProfile$(): Observable<InfoUser | null> {
    return this.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'usuarios', user?.uid);
        return docData(ref) as Observable<InfoUser>;
      })
    );
  }

  updateUser(user: InfoUser, url: any): Observable<any> {
    const ref = doc(this.firestore, 'usuarios', user.uid!);
    return from(updateDoc(ref, {...user, photoURL: url ?? user.photoURL}));
  }

  adicionarAdmin(user: InfoUser): Observable<any> {
    const ref = doc(this.firestore, 'usuarios', user.uid!);
    return from(updateDoc(ref,  {...user, isAdmin: user.isAdmin = true}))
  }

  removerAdmin(user: InfoUser): Observable<any> {
    const ref = doc(this.firestore, 'usuarios', user.uid!);
    return from(updateDoc(ref,  {...user, isAdmin: user.isAdmin = false}))
  }
}
