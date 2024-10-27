import { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils";
export default function SideNav({
  selectedPokeMon,
  setSelectedPokeMon,
  showSideMenu,
  handleToggleMenu,
}) {
  const [searchValue, setSearchValue] = useState("");

  const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
    // if full pokedex number includes the current search value, return true
    if (getFullPokedexNumber(eleIndex).includes(searchValue)) {
      return true;
    }

    // if the pokemon name includes the current search value, return true
    if (ele.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }

    // otherwise, exclude value from the array
    return false;
  });

  const showHamburger = !showSideMenu ? "" : "open";

  return (
    <nav className={showHamburger}>
      <div className={"header " + showHamburger}>
        <button onClick={handleToggleMenu}>
          <i className="fa-solid fa-arrow-left-long"></i>
        </button>
        <h1 className="text-gradient">Pokedex</h1>
      </div>
      <input
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        value={searchValue}
      />
      {filteredPokemon.map((pokemon, filteredIndex) => {
        const index = first151Pokemon.indexOf(pokemon);
        return (
          <button
            key={index}
            className={
              "nav-card " +
              (index === selectedPokeMon ? " nav-card-selected" : "")
            }
            onClick={() => setSelectedPokeMon(index)}
          >
            <p>{getFullPokedexNumber(index)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}
