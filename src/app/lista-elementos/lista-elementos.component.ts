import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lista-elementos',
  standalone: true,
  templateUrl: './lista-elementos.component.html',
  styleUrls: ['./lista-elementos.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ListaElementosComponent implements OnInit {
  elementos: any[] = []; 
  nuevoElemento: string = ''; 
  private apiKey = '61e2eea0d573446cb73c764a0890d81f'; // 🔥 Reemplázala con tu clave de RAWG
  private apiUrl = 'https://api.rawg.io/api/games';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarLista();
  }

  agregarElemento() {
    if (this.nuevoElemento.trim() !== '') {  
      this.buscarJuego(this.nuevoElemento);
      this.nuevoElemento = ''; 
    }
  }

  buscarJuego(nombre: string) {
    const url = `${this.apiUrl}?key=${this.apiKey}&search=${nombre}`;
    this.http.get<any>(url).subscribe((data) => {
      if (data.results.length > 0) {
        const juego = data.results[0]; // 🔥 Tomamos el primer resultado
        this.elementos.push({
          nombre: juego.name,
          imagen: juego.background_image,
          plataformas: juego.platforms.map((p: any) => p.platform.name).join(', '),
          lanzamiento: juego.released, // 📅 Fecha de lanzamiento
          metascore: juego.metacritic ?? 'No disponible' // 🎯 Metascore (si no hay, mostramos 'No disponible')
        });
        this.guardarLista();
      }
    });
  }

  borrarLista() {
    this.elementos = []; 
    if (typeof window !== 'undefined') {
      localStorage.removeItem('listaElementos'); 
    }
  }

  guardarLista() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('listaElementos', JSON.stringify(this.elementos));
    }
  }

  cargarLista() {
    if (typeof window !== 'undefined') {
      const listaGuardada = localStorage.getItem('listaElementos');
      if (listaGuardada) {
        this.elementos = JSON.parse(listaGuardada);
      }
    }
  }

  eliminarJuego(index: number) {
    this.elementos.splice(index, 1);
    this.guardarLista(); // Guardar cambios en localStorage
  }


}
