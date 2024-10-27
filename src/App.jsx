import { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import PokeCard from "./components/PokeCard";

function App() {
  const [selectedPokeMon, setSelectedPokeMon] = useState(0);
  const [showSideMenu, setShowSideMenu] = useState(false);

  function handleToggleMenu() {
    setShowSideMenu((prevState) => !prevState);
  }

  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        handleToggleMenu={handleToggleMenu}
        showSideMenu={showSideMenu}
        selectedPokeMon={selectedPokeMon}
        setSelectedPokeMon={setSelectedPokeMon}
      />
      <PokeCard selectedPokeMon={selectedPokeMon} />
    </>
  );
}

export default App;
