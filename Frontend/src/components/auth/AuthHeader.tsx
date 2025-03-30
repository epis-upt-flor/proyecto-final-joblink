export default function AuthHeader() {
    return (
      <div className="w-full p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <div className="font-bold text-xl text-blue-900">LinkJob</div>
        <nav className="mt-4 lg:mt-0">
          <ul className="flex space-x-6 text-gray-600">
            {["Home", "Perfil", "About", "Portfolio", "Contact"].map((item, i) => (
              <li key={i} className="hover:text-blue-600 cursor-pointer">{item}</li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }
  