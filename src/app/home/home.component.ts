import { Component, OnInit } from '@angular/core';
import { DiariosService } from '../core/services/diarios/diarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss',
    './styles/keyframes.scss',
    './styles/media-queries.scss',
    './styles/cards.scss'
  ]
})
export class HomeComponent implements OnInit {
  diarios!: any[];
  span = 10;
  constructor(
    private diarioService: DiariosService
  ) { }

  ngOnInit(): void {

    const random = Math.floor(Math.random() * 6);
    this.diarioService.getTodosDiarios()
      .subscribe(
        res => {
          this.diarios = res.slice(0, 3);
        });

  }
}
