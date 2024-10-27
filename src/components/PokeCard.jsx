import { useEffect, useState } from "react";
import { getPokedexNumber, getFullPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard({ selectedPokeMon }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};
  const imgList = Object.keys(sprites || {}).filter((key) => {
    if (!sprites[key]) return false;
    if (["versions", "other"].includes(key)) return false;
    return true;
  });

  async function fetchMoveData(move, url) {
    if (loadingSkill || !url) return;
    let obj = {};
    let item = localStorage.getItem("pokemon-moves");
    if (item) {
      obj = JSON.parse(item);
    }
    if (move in obj) {
      setSkill(obj[move]);
      return;
    }

    try {
      setLoadingSkill(true);
      const res = await fetch(url);
      const moveData = await res.json();
      const description = moveData?.flavor_text_entries.filter((val) => {
        return (val.version_group.name = "firered-leafgreen");
      })[0]?.flavor_text;

      const skillData = {
        name: move,
        description,
      };
      setSkill(skillData);
      obj[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(obj));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    if (loading) {
      return;
    }
    let cache = {};
    let cachedData = localStorage.getItem("pokedex");
    if (cachedData) {
      cache = JSON.parse(cachedData);
    }

    if (selectedPokeMon in cache) {
      setData(cache[selectedPokeMon]);
      return;
    }

    (async function fetchPokeMonData() {
      try {
        const url =
          "https://pokeapi.co/api/v2/" +
          "pokemon/" +
          getPokedexNumber(selectedPokeMon);
        const res = await fetch(url);
        const pokemonData = await res.json();
        setData(pokemonData);
        cache[selectedPokeMon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedPokeMon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }
  return (
    <div className="poke-card">
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill?.name.replaceAll("-", " ")}</h2>
          </div>
          <h6>Description</h6>
          <p>{skill?.description}</p>
          <div></div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokeMon)}</h4>
        <h2>{name}</h2>
        <div className="type-container">
          {types.map((typeObj, index) => {
            return <TypeCard key={index} type={typeObj?.type?.name} />;
          })}
        </div>
      </div>
      <img
        className="default-img"
        src={"./pokemon/" + getFullPokedexNumber(selectedPokeMon) + ".png"}
        alt={`${name}-large-img`}
      />
      <div className="img-container">
        {imgList.map((spriteUrl, index) => {
          const imgURl = sprites[spriteUrl];
          return <img key={index} src={imgURl} alt="" />;
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, index) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={index} className="stat-item">
              <p>{stat?.name.replaceAll("-", "")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((obj, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                fetchMoveData(obj?.move?.name, obj?.move?.url);
              }}
              className="button-card pokemon-move"
            >
              <p>{obj?.move?.name.replaceAll("-", "")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
