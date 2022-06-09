import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Diario } from '../../models/diario';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  logged$?: Observable<any>;
  user$?: Observable<Diario[]>
  userPhoto!: any;
  isAdmin?: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService
    ) {}

  logout() {
    this.authService.logout('/login').subscribe();
  }

  rotaAdmin() {
    console.log('clickou');
    this.authService.rotaAdmin('/user');
  }

  changeImageProfile() {
    let photo = document.querySelector('.photoStyle');
    let photoTwo = document.querySelector('.example-header-image');
      if(this.userPhoto !== 'undefined') {
        photo?.classList.remove('photoStyle');
        photoTwo?.classList.remove('example-header-image');
        photo?.setAttribute('id', 'photoStyleTemp');
      }
  }

  ngOnInit(): void {
    this.logged$ = this.authService.logged;
    this.userService.currentProfile$.subscribe(res => {
      this.userPhoto = res?.photoURL
      this.changeImageProfile();
      this.authService.isAdmin.subscribe(res => {
        this.isAdmin = res
        console.log(this.isAdmin);
      })

    })
  }
}
