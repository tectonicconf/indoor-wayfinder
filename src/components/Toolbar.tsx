import SearchBar from "./SearchBar";

function Toolbar() {
  return (
    <div className="flex mb-1.5 md:mb-0 h-12 flex-none relative">
      <SearchBar />
    </div>
  );
}

export default Toolbar;
