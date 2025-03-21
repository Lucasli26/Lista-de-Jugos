import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { ListaElementosComponent } from './lista-elementos/lista-elementos.component';
import { TierListComponent } from './tier-list/tier-list.component'; // Importa el componente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ListaElementosComponent, HttpClientModule, TierListComponent], // Agregamos HttpClientModule aquí
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lista-de-elementos';
}
