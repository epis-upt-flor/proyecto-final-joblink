export default function AuthIllustration() {
    return (
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="relative">
          <div className="absolute top-0 right-0 flex space-x-4">
            {[...Array(3)].map((_, i) => (
              <div className="text-slate-200" key={i}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            ))}
          </div>
  
          <div className="bg-blue-500 rounded-lg p-6 mt-8 relative">
            <div className="bg-blue-800 h-6 rounded-t-lg flex items-center justify-end px-2 space-x-1 -mt-6 -mx-6">
              {[...Array(3)].map((_, i) => (
                <div className="h-2 w-2 bg-white rounded-full" key={i}></div>
              ))}
            </div>
  
            <div className="flex justify-center my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-blue-900"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
  
            <div className="bg-white rounded p-2 mb-2 flex items-center space-x-2">
              <svg className="h-5 w-5 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
              <span className="text-gray-500">xxxxxx</span>
            </div>
  
            <div className="bg-white rounded p-2 flex items-center space-x-2">
              <svg className="h-5 w-5 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-gray-500">• • • • • •</span>
            </div>
          </div>
  
          <div className="flex justify-between mt-4">
            <img src="/placeholder.svg?height=150&width=100" alt="Phone user" className="object-contain" />
            <img src="/placeholder.svg?height=150&width=150" alt="Laptop user" className="object-contain" />
          </div>

          <div className="absolute -left-10 bottom-20 text-slate-200 opacity-30">
            <svg className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3v12" />
              <path d="M18 9a3 3 0 0 0-3-3H7" />
              <path d="M3 18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-6" />
              <path d="M3 12h6" />
            </svg>
          </div>
          <div className="absolute -right-10 bottom-10 text-slate-200 opacity-30">
            <svg className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3v12" />
              <path d="M18 9a3 3 0 0 0-3-3H7" />
              <path d="M3 18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-6" />
              <path d="M3 12h6" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  