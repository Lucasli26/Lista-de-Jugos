import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 📌 IMPORTAR FormsModule

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tier-list',
  standalone: true,
  templateUrl: './tier-list.component.html',
  styleUrls: ['./tier-list.component.css'],
  imports: [FormsModule, CommonModule] // 📌 AGREGAR FormsModule AQUÍ
})
export class TierListComponent {
  tierList: any[] = [];
  tiers = ["S+", "S", "A+", "A", "B+", "B", "C+", "C", "D+", "D", "E"];

  constructor() {
    this.cargarTierList();
  }

  private cargarTierList() {
    const data = localStorage.getItem('tierList');
    if (data) {
      this.tierList = JSON.parse(data);
    }
  }

  cambiarNivel(juego: any, nivel: string) {
    const index = this.tierList.findIndex(j => j.nombre === juego.nombre);
    if (index !== -1) {
      this.tierList[index].nivel = nivel;
      this.guardarEnLocalStorage();
    }
  }

  private guardarEnLocalStorage() {
    localStorage.setItem('tierList', JSON.stringify(this.tierList));
  }
}
