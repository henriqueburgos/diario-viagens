import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TermosDePrivacidadeComponent } from './components/termos-de-privacidade/termos-de-privacidade.component';

@NgModule({
  declarations: [
    
    LoaderComponent, TermosDePrivacidadeComponent
  ],
  imports: [
    CommonModule, 
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule
  ],
  exports: [
    LoaderComponent,
    TermosDePrivacidadeComponent
  ],
})
export class SharedModule {}

