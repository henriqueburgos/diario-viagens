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
    let photo = document.querySelector('.example-header-image');
      if(this.userPhoto !== 'undefined') {
        photo?.classList.remove('example-header-image')
        photo?.classList.add('img-header');
      }
  }

  ngOnInit(): void {
    this.logged$ = this.authService.logged;
    this.userService.currentProfile$.subscribe(res => {
      this.userPhoto = res?.photoURL
      // this.changeImageProfile();
      console.log(typeof(this.userPhoto));
    })


  }
}
