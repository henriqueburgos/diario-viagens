import { Injectable } from '@angular/core';
import { Auth, authState, FacebookAuthProvider, GithubAuthProvider } from '@angular/fire/auth';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from '@firebase/auth';
import { addDoc, collection, setDoc, updateDoc } from '@firebase/firestore';
import { create } from 'domain';
import { first, from, map, Observable, switchMap, tap } from 'rxjs';

// Firebase Versão Modular
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth, // serviços do firebase authentication
    private db: Firestore, // serviços de banco firestore do firebase
    private router: Router // mudar de rota de forma imperativa
  ) {}

  uid?: string; // guarda o id único do usuário logado

  get logged() {
    // se é null, o usuário está deslogado
    return authState(this.auth).pipe(
      tap((user) => {
        // conforme o usuário loga/desloga
        // é atualizado o valor de id
        this.uid = user?.uid;
      })
    );
  }

  get userData() {
    // Referencia o documento do usuário logado
    const userDoc = doc(this.usuarios, this.uid);
    // "Pega" apenas a primeira amostra de dados e encerra o observable
    return docData(userDoc).pipe(first());
  }

  get isAdmin() {
    return authState(this.auth).pipe( // busca dados do auth do usuario logado
      first(), // recebe apenas a primeira info
      switchMap((user: any) => { // emite um novo obs com base no user
        const userDoc = doc(this.usuarios, user?.uid);
        return docData(userDoc).pipe(first()); // verifica o documento no banco
      }),
      map((user) =>
      user['isAdmin'] === true) /* verifica se o user logado possui a propriedade*/
    );
  }

  rotaAdmin(router: '/user') {
    console.log('chegoiu aqui');
    this.router.navigate([router])
  }

  usuarios = collection(this.db, 'usuarios'); // referencia possível coleção

  signupEmail(email: string, password: string, nome: string, nick: string) {
    // Se comunica com o auth e cria um usuário a partir do email e senha
    // Pode ocorrer erros por isso é importante retornar o observable
    // para monitorar o ocorrido.
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      tap((creds) => {
        // cadastro deu certo
        const user = creds.user; // informações do usuário logado
        const userDoc = doc(this.usuarios, user.uid); // referencia um documento de usuário no firestore
        // Seta os dados do objeto dentro do documento com o mesmo id do usuário cadastrado
        // OBS: o setDoc remove os dados atuais do documento e seta os novos do objeto do parâmetro
        setDoc(userDoc, {
          uid: user.uid,
          photoURL: user.photoURL,
          email: email,
          nome: nome,
          nick: nick,
        });

        this.emailVerificacao(creds.user);
      })
    );
  }

  loginEmail(email: string, password: string) {
    // Realiza o login com base no email/senha
    // O return é necessário para o componente de login
    // usar subscribe e "saber" quando o login falhou
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap((creds) => {
        this.emailVerificacao(creds.user);
      })
    );
  }

  logout(rota: '/login' | '/confirmar-email') {
    // Desloga o usuário e ao final
    // navega para uma rota determinada
    return from(this.auth.signOut()).pipe(
      tap(() => {
        this.router.navigate([rota]); // redireciona para a rota escolhida
      })
    );
  }

  emailVerificacao(user: any) {
    if (!user.emailVerified) {
      sendEmailVerification(user);
      this.logout('/confirmar-email').subscribe();
    } else {
      this.router.navigate(['/']);
    }
  }

  loginGoogle() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      tap((creds) => {
        const user = creds.user;
        const userDoc = doc(this.usuarios, user.uid);
        // updateDoc faz uma atualização parcial = atualiza apenas o que está diferente no doc do firebase
        // updateDoc: só funciona se o doc já existe
        setDoc(userDoc, {
          uid: user.uid,
          email: user.email,
          nome: user.displayName, // 'displayName' contém o nome do usuário do google
          nick: 'Um usuário do Google',
        });

        this.router.navigate(['/']);
      })
    );
  }

  loginFacebook(){
    return from(signInWithPopup(this.auth, new FacebookAuthProvider())).pipe(
      tap((result)=>{
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user1= result.user;
      const userDoc = doc(this.usuarios, user1.uid);

      setDoc(userDoc, {
        uid: user1.uid,
        email: user1.email,
        nome: user1.displayName,
        imagem: user1.photoURL,
        nick: 'Um usuário facebook ',
      });
      this.router.navigate(['/']);
      })
    )
  }

  loginGitHub(){
    return from(signInWithPopup(this.auth, new GithubAuthProvider())).pipe(
      tap((result)=>{
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user= result.user;
      const userDoc = doc(this.usuarios, user.uid);

      setDoc(userDoc, {
        uid: user.uid,
        email: user.email,
        nome: user.displayName,
        imagem: user.photoURL,
        nick: 'Um usuário do GitHub',
      });
      this.router.navigate(['/']);
      })
    )
  }


  recoverPassword(email: string) {
    // com base no email do parâmetro envia um email para o usuário redefinir/resetar a senha
    return from(sendPasswordResetEmail(this.auth, email));
  }
}
