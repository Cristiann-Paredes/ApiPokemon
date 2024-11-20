import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { AlertController, ToastController } from '@ionic/angular';

interface Pokemon {
  name: string;
  url: string;
  isFavorite?: boolean;
}

interface PokemonDetails {
  id: number;
  name: string;
  isFavorite?: boolean;
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  height: number;
  weight: number;
  moves: { move: { name: string } }[];
  species?: { url: string };
}

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  searchQuery: string = '';
  pokemonDetails: PokemonDetails | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  pageSize: number = 20;
  currentPage: number = 1;
  totalPokemons: number = 0;

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.fetchPokemons();
  }

  /**
   * Busca un Pokémon por su nombre y actualiza la UI en consecuencia.
   * Si el usuario borra el campo de búsqueda, se vuelve a mostrar la lista de
   * Pokémon.
   * La búsqueda se hace en minúsculas.
   */
  searchPokemon(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.resetSearch();
      return;
    }

    this.loading = true;
    this.pokemonService.getPokemonDetails(query).subscribe({
      next: (response: PokemonDetails) => {
        this.pokemonDetails = response;
        this.pokemonDetails.isFavorite = this.favoritesService.isFavorite(
          response.name
        );
        this.errorMessage = '';
        this.filteredPokemons = [];
      },
      error: () => {
        this.errorMessage = 'Pokémon no encontrado';
        this.pokemonDetails = null;
      },
      complete: () => (this.loading = false),
    });
  }

/**
 * Fetches a list of Pokémon from the API and updates the local state with the fetched data.
 * 
 * If `loadMore` is true, the retrieved Pokémon are appended to the existing list, 
 * otherwise, the list is replaced with the newly fetched Pokémon.
 * 
 * The function calculates the offset based on the current page and page size to 
 * fetch the appropriate set of Pokémon. It retrieves detailed information for each Pokémon 
 * and checks if they are marked as favorites.
 * 
 * Updates `totalPokemons`, `pokemons`, and `filteredPokemons` with the fetched data.
 * Handles errors and completes the loading state.
 * 
 * @param loadMore - A boolean indicating whether to load more Pokémon or reset the list.
 */
  fetchPokemons(loadMore: boolean = false): void {
    this.loading = true;
    const offset = (this.currentPage - 1) * this.pageSize;
    this.pokemonService.getPokemons(this.pageSize, offset).subscribe({
      next: async (response: { count: number; results: Pokemon[] }) => {
        this.totalPokemons = response.count;

        const pokemonDetails = await Promise.all(
          response.results.map((pokemon) =>
            this.pokemonService.getPokemonDetails(pokemon.name).toPromise()
          )
        );

        const enrichedPokemons = pokemonDetails.map((detail) => ({
          name: detail.name,
          url: detail.species?.url || '',
          isFavorite: this.favoritesService.isFavorite(detail.name), // Verificar si es favorito
        }));

        this.pokemons = loadMore
          ? [...this.pokemons, ...enrichedPokemons]
          : enrichedPokemons;

        this.filteredPokemons = [...this.pokemons];
      },
      error: () => {
        this.errorMessage = 'Error al cargar la lista de Pokémon';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  /**
   * Retrieves the list of favorite Pokémon from the FavoritesService.
   * 
   * @returns An array of favorite Pokémon.
   */
  getFavorites() {
    return this.favoritesService.getFavorites();
  }

  /**
   * Toggles the favorite status of the given Pokémon.
   * 
   * This method adds or removes the given Pokémon from the list of favorites.
   * If the Pokémon is added, the PokemonDetails object is updated with the new favorite status.
   * If the Pokémon is removed, the PokemonDetails object is updated with the new favorite status.
   * The list of Pokémon is updated with the new favorite status of the given Pokémon.
   * @param pokemon The Pokémon to toggle the favorite status of.
   */
  toggleFavorite(pokemon: Pokemon | PokemonDetails): void {
    const name = pokemon.name;
    if (this.favoritesService.isFavorite(name)) {
      this.removeFromFavorites({
        name,
        url: (pokemon as PokemonDetails).species?.url || '',
      });
    } else {
      this.addToFavorites({
        name,
        url: (pokemon as PokemonDetails).species?.url || '',
      });
    }

    this.pokemons = this.pokemons.map((p) => {
      if (p.name === name) {
        p.isFavorite = this.favoritesService.isFavorite(name);
      }
      return p;
    });

    if (this.pokemonDetails?.name === name) {
      this.pokemonDetails.isFavorite = this.favoritesService.isFavorite(name);
    }
  }

  /**
   * Adds the given Pokémon to the list of favorites.
   * 
   * This method adds the given Pokémon to the list of favorites using the FavoritesService.
   * It also shows a success toast with a message indicating that the Pokémon was added to favorites.
   * If the Pokémon is the same as the one in the PokemonDetails object, the PokemonDetails object is updated with the new favorite status.
   * @param pokemon The Pokémon to add to the list of favorites.
   */
  addToFavorites(pokemon: Pokemon): void {
    this.favoritesService.addFavorite(pokemon);
    this.showToast(`${pokemon.name} añadido a favoritos`, 'success');
    if (this.pokemonDetails?.name === pokemon.name) {
      this.pokemonDetails.isFavorite = true;
    }
  }


  /**
   * Removes the given Pokémon from the list of favorites.
   * 
   * This method removes the given Pokémon from the list of favorites using the FavoritesService.
   * It also shows a danger toast with a message indicating that the Pokémon was removed from favorites.
   * If the Pokémon is the same as the one in the PokemonDetails object, the PokemonDetails object is updated with the new favorite status.
   * @param pokemon The Pokémon to remove from the list of favorites.
   */
  removeFromFavorites(pokemon: Pokemon): void {
    this.favoritesService.removeFavorite(pokemon.name);
    this.showToast(`${pokemon.name} eliminado de favoritos`, 'danger');
    if (this.pokemonDetails?.name === pokemon.name) {
      this.pokemonDetails.isFavorite = false;
    }
  }


  loadMorePokemons(): void {
    this.currentPage++;
    this.fetchPokemons(true);
  }


  /**
   * Returns the color associated with the given stat name.
   * 
   * This method uses a predefined object to map stat names to their respective colors.
   * If the given stat name is not found in the object, it returns the color 'medium' by default.
   * @param statName The stat name to retrieve the color of.
   * @returns The color associated with the given stat name.
   */
  getStatColor(statName: string): string {
    const statColors: Record<string, string> = {
      hp: 'danger',
      attack: 'primary',
      defense: 'secondary',
      'special-attack': 'tertiary',
      'special-defense': 'success',
      speed: 'warning',
    };
    return statColors[statName] || 'medium';
  }


  private resetSearch(): void {
    this.pokemonDetails = null;
    this.filteredPokemons = [...this.pokemons];
  }
  /**
   * Displays a toast message with the specified content and color.
   * 
   * The toast is displayed at the bottom of the screen for a duration of 2 seconds.
   * 
   * @param message - The message to display in the toast.
   * @param color - The color of the toast, which determines its appearance.
   * @returns A promise that resolves when the toast has been presented.
   */

  async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
