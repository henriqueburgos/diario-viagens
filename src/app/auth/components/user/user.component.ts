import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FormControl, FormGroup } from '@angular/forms';
import { concatMap } from 'rxjs';
import { UploadService } from 'src/app/core/services/upload/upload.service'

@Component({
  selector: 'app-user-admin',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  infoUser$ = this.userService.currentUser$;

  adminBoolean!: boolean;
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
    let photo = document.querySelector('.image-example');
      if(this.userPhoto != 'undefined') {
        photo?.classList.remove('image-example');
        photo?.classList.add('img-header');
      }

    console.log(this.userPhoto);
  }

  ngOnInit() {
    this.userService.currentProfile$.pipe().subscribe((user) => {
        this.updateProfileForm.patchValue({ ...user });
      });

    this.authService.isAdmin.subscribe(res => {
      this.adminBoolean = res;
    })
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
