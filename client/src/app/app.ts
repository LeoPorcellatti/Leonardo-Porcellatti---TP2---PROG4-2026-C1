import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.development';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  httpClient = inject(HttpClient);

  futbolistas = signal<any[]>([]);

  ngOnInit(): void {
    const peticion = this.httpClient.get(environment.apiUrl + '/futbolistas');

    peticion.subscribe((val) => {
      this.futbolistas.set(val as any[]);
    });
  }
}
