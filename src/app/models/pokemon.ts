export interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface Form {
  name: string;
  url: string;
}

export interface GameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface Cry {
  latest: string;
  legacy: string;
}

export interface MoveLearnMethod {
  name: string;
  url: string;
}

export interface VersionGroup {
  name: string;
  url: string;
}

export interface MoveVersionGroupDetail {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  version_group: VersionGroup;
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
  version_group_details: MoveVersionGroupDetail[];
}

export interface Pokemon {
  abilities: Ability[];
  base_experience: number;
  cries: Cry;
  forms: Form[];
  game_indices: GameIndex[];
  height: number;
  held_items: any[]; // Puede ser un array vacío o de cualquier tipo
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Move[];
}
