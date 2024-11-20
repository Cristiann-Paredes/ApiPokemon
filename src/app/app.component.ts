import { Component, OnInit } from '@angular/core';
import { FavoritesService } from './services/favorites.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  favorites: any[] = [];

  constructor(private favoritesService: FavoritesService, private router: Router) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }

  viewPokemon(pokemon: any) {
    this.router.navigate(['/pokemon-list'], {
      queryParams: { name: pokemon.name },
    });
  }
}
