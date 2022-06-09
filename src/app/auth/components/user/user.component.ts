import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FormControl, FormGroup } from '@angular/forms';
import { concatMap } from 'rxjs';
import { UploadService } from 'src/app/core/services/upload/upload.service'
import { InfoUser } from 'src/app/core/models/infoUser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  infoUser$ = this.userService.currentUser$;
  usuarios: InfoUser[] = [];
  isUserAdmin?: boolean;
  user$ = this.authService.uid;
  userPhoto?: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: HotToastService,
    private uploadService: UploadService
    ) {}

    updateProfileForm = new FormGroup({
      uid: new FormControl(''),
      nome: new FormControl(''),
      nick: new FormControl(''),
      email: new FormControl(''),
      photoURL: new FormControl('')
    })

  setImage(ev: any, user: User) {
    // target é o input file
    this.uploadService.upload(ev.target.files[0],  `imagens/users${user.uid}`)
    .pipe(
      this.toast.observe({
        loading: 'Upload da imagem...',
        success: 'Imagem atualizada!',
        error: 'Ocorreu um erro!',
      }),

    ).subscribe(res => {
      this.userPhoto = res;
      concatMap((photoURL: string) => {
        return this.userService.updateProfileData({photoURL})
      })
    })

    this.changeImageProfile();
  }

  changeImageProfile() {
    let photo = document.querySelector('img');
      if(this.userPhoto != 'undefined') {
        photo?.setAttribute('id', 'photoStyleTemp');
      }

    console.log(this.userPhoto);
  }

  ngOnInit() {
    this.userService.currentProfile$.pipe().subscribe((user) => {
        this.updateProfileForm.patchValue({ ...user });
      });
  }

  onSubmit() {
  const form = this.updateProfileForm.value;

    this.userService.updateUser(form, this.userPhoto)
    .pipe(this.toast.observe({
      loading: 'Carregando...',
      success: 'Perfil Atualizado',
      error: 'Um erro aconteceu',
    })
    ).subscribe(res => console.log(res)
    )
  }
}
