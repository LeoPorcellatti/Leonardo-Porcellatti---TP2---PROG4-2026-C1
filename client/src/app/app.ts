import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // httpClient = inject(HttpClient);

  // futbolistas = signal<any[]>([]);

  ngOnInit(): void {
    // const peticion = this.httpClient.get(environment.apiUrl + '/futbolistas');
    // peticion.subscribe((val) => {
    //   this.futbolistas.set(val as any[]);
    // });
  }
}
