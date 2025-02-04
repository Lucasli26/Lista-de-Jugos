import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {
  private apiKey = '61e2eea0d573446cb73c764a0890d81f'; // 🔥 Reemplázala con tu clave de RAWG
  private apiUrl = 'https://api.rawg.io/api/games';

  constructor(private http: HttpClient) {}

  buscarJuego(nombre: string): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&search=${nombre}`;
    return this.http.get(url);
  }
}
