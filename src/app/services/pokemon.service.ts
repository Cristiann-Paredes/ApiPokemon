import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) {}

  /**
   * @description
   * Returns a list of Pokemon from the PokeAPI. The list is paginated
   * by the limit and offset parameters.
   * @param {number} limit The maximum number of Pokemon to return.
   * @param {number} [offset=0] The starting index of the Pokemon list.
   * @returns {Observable<any>} An observable containing the list of Pokemon.
   */
  getPokemons(limit: number, offset: number = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}pokemon?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * @description
   * Retrieves detailed information about a specific Pokémon from the PokeAPI.
   * 
   * @param {string} name The name of the Pokémon to retrieve details for.
   * @returns {Observable<any>} An observable containing the Pokémon's details.
   */
  getPokemonDetails(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}pokemon/${name}`);
  }
}
