import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Diario } from 'src/app/core/models/diario';
import { DiariosService } from 'src/app/core/services/diarios/diarios.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-diario-detail',
  templateUrl: './diario-detail.component.html',
  styleUrls: ['./diario-detail.component.scss'],
})
export class DiarioDetailComponent implements OnInit {
  diario$?: Observable<Diario>;
  userPhoto!: any;

  constructor(
    private route: ActivatedRoute, 
    private diariosService: DiariosService,
    private userService: UserService
  ) {}

  changeImageProfile() {
    let photo = document.querySelector('.photo-header');
      photo?.classList.remove('photo-header');
      photo?.classList.add('img-header');
  }

  ngOnInit(): void {
    this.diario$ = this.diariosService.getDiarioById(
      this.route.snapshot.params['id']
    );

    this.userService.currentProfile$.subscribe(res => {
      this.userPhoto = res?.photoURL
      this.changeImageProfile();
    })
  }
}
