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
  juegosTerminados: any[] = []; // Almacena los juegos terminados
  nuevoElemento: string = '';
  sugerencias: any[] = [];
  private apiKey = '61e2eea0d573446cb73c764a0890d81f'; // 🔥 Reemplázala con tu clave de RAWG
  private apiUrl = 'https://api.rawg.io/api/games';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarLista();
    this.cargarJuegosTerminados();
  }

  agregarElemento() {
    if (this.nuevoElemento.trim() !== '') {
      this.buscarJuego(this.nuevoElemento);
      this.nuevoElemento = ''; // Limpiar el campo después de agregar
      this.sugerencias = []; // Limpiar las sugerencias
    }
  }


  buscarJuego(nombre: string) {
    const url = `${this.apiUrl}?key=${this.apiKey}&search=${nombre}`;
    this.http.get<any>(url).subscribe((data) => {
      if (data.results.length > 0) {
        const juego = data.results[0];
        this.elementos.push({
          nombre: juego.name,
          imagen: juego.background_image,
          plataformas: juego.platforms.map((p: any) => p.platform.name).join(', '),
          lanzamiento: juego.released,
          metascore: juego.metacritic ?? 'No disponible',
        });
        this.guardarLista();
      }
    });
  }

  // 🔍 Buscar sugerencias a medida que el usuario escribe
  buscarSugerencias(nombre: string) {
    if (nombre.length < 3) {
      this.sugerencias = []; // Limpiar si no hay suficiente texto
      return;
    }
    const url = `${this.apiUrl}?key=${this.apiKey}&search=${nombre}`;
    this.http.get<any>(url).subscribe((data) => {
      this.sugerencias = data.results.slice(0, 5); // Mostrar solo las primeras 5 sugerencias
    });
  }

  // ✅ Cuando el usuario selecciona una sugerencia
  seleccionarJuego(juego: any) {
    this.nuevoElemento = juego.name; // Poner el nombre en el input
    this.sugerencias = []; // Limpiar la lista de sugerencias
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

  // Método para marcar un juego como acabado
  marcarComoAcabado(juego: any) {
    // Verificar si el juego ya está en la lista de terminados
    const existe = this.juegosTerminados.some((j) => j.nombre === juego.nombre);

    if (!existe) {
      // Añadir el juego al array de juegos terminados
      juego.puntuacion = 0;
      this.juegosTerminados.push(juego);
      this.guardarJuegosTerminados(); // Guardar en localStorage
      console.log(`Juego "${juego.nombre}" marcado como acabado.`);
    } else {
      console.log(`El juego "${juego.nombre}" ya está en la lista de terminados.`);
    }
  }

  // Guardar la lista de juegos terminados en localStorage
  guardarJuegosTerminados() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('juegosTerminados', JSON.stringify(this.juegosTerminados));
    }
  }

  // Cargar la lista de juegos terminados desde localStorage
  cargarJuegosTerminados() {
    if (typeof window !== 'undefined') {
      const juegosTerminadosGuardados = localStorage.getItem('juegosTerminados');
      if (juegosTerminadosGuardados) {
        this.juegosTerminados = JSON.parse(juegosTerminadosGuardados);
      }
    }
  }
  // Método para eliminar un juego de la lista de terminados
  eliminarJuegoTerminado(index: number) {
    this.juegosTerminados.splice(index, 1); // Eliminar el juego del array
    this.guardarJuegosTerminados(); // Guardar cambios en localStorage
  }

  // Método para puntuar un juego y asignarlo a un Tier
  puntuarJuego(juego: any) {
    // Asignar el Tier según la puntuación
    juego.tier = this.obtenerTier(juego.puntuacion);
    console.log(`Juego "${juego.nombre}" puntuado con ${juego.puntuacion} y asignado al Tier ${juego.tier}.`);

    // Guardar cambios en localStorage
    this.guardarJuegosTerminados();
  }

  // Método para obtener el Tier según la puntuación
  obtenerTier(puntuacion: number): string {
    if (puntuacion === 10) return 'S+';
    if (puntuacion === 9) return 'S';
    if (puntuacion >= 7 && puntuacion <= 8) return 'A';
    if (puntuacion >= 5 && puntuacion <= 6) return 'B';
    if (puntuacion >= 3 && puntuacion <= 4) return 'C';
    if (puntuacion >= 1 && puntuacion <= 2) return 'D';
    return 'E'; // Puntuación 0
  }

}
