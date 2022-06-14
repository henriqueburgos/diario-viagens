import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DiarioListComponent } from '../diario-list/diario-list.component';

@Component({
  selector: 'app-diario-delete',
  templateUrl: './diario-delete.component.html',
  styleUrls: ['./diario-delete.component.scss']
})
export class DiarioDeleteComponent implements OnInit {


  constructor(private ref: MatDialogRef<DiarioListComponent>) { };

  onconfirm(){
    this.ref.close(true);
  }

  
  ngOnInit(): void {
  }

}
