import { useTheme } from "next-themes";

function Header() {
  const { theme, setTheme } = useTheme();

  function changeTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }
  return (
    <header className="dark:bg-neutral-950 dark:border-neutral-700 bg-white border-neutral-200 border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <img
          src={theme === "dark" ? "chaicode-white.svg" : "chaicode-black.svg"}
          alt="chaiCode"
          className="w-50 h-10"
        />
        <div>
          <a
            href="https://www.imvkc.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-4xl font-bold cursor-pointer hover:bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:bg-clip-text hover:text-transparent hover:underline tracking-wide"
          >
            imvkc.in
          </a>
        </div>
        <button
          onClick={changeTheme}
          className={`p-2 rounded-lg "dark:bg-neutral-700 dark:hover:bg-neutral-600 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 transition-colors`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

export default Header;
