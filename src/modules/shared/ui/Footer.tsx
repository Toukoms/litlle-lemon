export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} Tokiniaina. All rights reserved.</p>
      </div>
    </footer>
  );
}
