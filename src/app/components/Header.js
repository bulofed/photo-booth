import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header({ 
  title = "FotoFoto",
  bgColor = "bg-indigo-500",
  textColor = "text-white",
  showHomeLink = true 
}) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <nav 
        className={`w-full ${bgColor} flex`}
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-6xl w-full py-3 px-8 flex justify-between items-center">
          <h1 className={`text-4xl font-bold ${textColor} max-w-2xl`}>
            {showHomeLink && !isHomePage ? (
              <Link 
                href="/" 
                className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500 rounded"
                aria-label="Return to homepage"
              >
                {title}
              </Link>
            ) : (
              <span>{title}</span>
            )}
          </h1>
        </div>
      </nav>
    </header>
  );
}