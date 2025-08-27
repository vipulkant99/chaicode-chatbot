function Header({ dark, setDarkMode }) {
  return (
    <header className="dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200 border-b px-6 py-4">
      <div className="flex justify-between items-center">
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
        <h1 className="text-2xl font-bold">ChaiCode Courses</h1>
        <button
          onClick={setDarkMode}
          className={`p-2 rounded-lg "dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors`}
        >
          {dark === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

export default Header;
