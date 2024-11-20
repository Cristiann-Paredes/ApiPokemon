import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'; // Necesario para hacer peticiones HTTP
import { FormsModule } from '@angular/forms'; // Necesario para usar ngModel en ion-searchbar

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule // Importa FormsModule aquí
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
