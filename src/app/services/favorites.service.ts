import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesKey = 'pokemon_favorites';

  constructor() {}

  /**
   * Retrieves the list of Pokémon marked as favorites from the local storage.
   *
   * @returns An array of Pokémon objects, or an empty array if no favorites are found.
   */
  getFavorites(): any[] {
    const favorites = localStorage.getItem(this.favoritesKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  /**
   * Adds a Pokémon to the list of favorites if it is not already present.
   *
   * @param pokemon The Pokémon object to add to the list of favorites.
   */
  addFavorite(pokemon: any) {
    const favorites = this.getFavorites();
    if (!favorites.find((fav: any) => fav.name === pokemon.name)) {
      favorites.push(pokemon);
      localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    }
  }



  /**
   * Removes a Pokémon from the list of favorites.
   *
   * @param name The name of the Pokémon to remove from the list of favorites.
   */
  removeFavorite(name: string) {
    const favorites = this.getFavorites().filter(
      (fav: any) => fav.name !== name
    );
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
  }

  /**
   * Checks if a Pokémon with the given name is marked as a favorite.
   *
   * @param name - The name of the Pokémon to check.
   * @returns A boolean indicating whether the specified Pokémon is a favorite.
   */
  isFavorite(name: string): boolean {
    return !!this.getFavorites().find((fav: any) => fav.name === name);
  }
}
