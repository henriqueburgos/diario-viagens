import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { MaterialModule } from './material.module';
import { RecaptchaComponent } from './components/recaptcha/recaptcha.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TermosDePrivacidadeComponent } from './components/termos-de-privacidade/termos-de-privacidade.component';

@NgModule({
  declarations: [
    
    LoaderComponent, RecaptchaComponent, TermosDePrivacidadeComponent
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
    RecaptchaComponent,
    TermosDePrivacidadeComponent
  ],
})
export class SharedModule {}

