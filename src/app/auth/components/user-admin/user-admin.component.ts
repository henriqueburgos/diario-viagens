import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { HotToastService } from '@ngneat/hot-toast';
import { InfoUser } from 'src/app/core/models/infoUser';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss']
})
export class UserAdminComponent implements OnInit {
  @ViewChild(MatAccordion) accordion?: MatAccordion;
  usuarios: InfoUser[] = [];

  constructor(
    private userService: UserService,
    private toast: HotToastService,
  ) { }

  ngOnInit(): void {
    this.userService.getUsuarios().subscribe(res => this.usuarios = res)
  }

  addAdmin(user: InfoUser) {
    this.userService.adicionarAdmin(user).pipe(
      this.toast.observe({
        success: 'Adicionando como administrador',
        error: 'Um erro ocorreu',
        loading: 'Adicionando administrador',
      })
    ).subscribe()

  }

  removerAdmin(user: InfoUser) {
    this.userService.removerAdmin(user).pipe(
      this.toast.observe({
        success: 'Administrador removido',
        error: 'Um erro ocorreu',
        loading: 'Removendo administrador',
      })
    ).subscribe()

  }

}
