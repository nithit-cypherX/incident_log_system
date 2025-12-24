// File: src/components/layouts/Footer.tsx
/**
 * What it does:
 * Renders the simple page footer.
 *
 * How it works:
 * - A simple, "dumb" component with static content.
 *
 * How it connects:
 * - Rendered by 'MainLayout.tsx' and 'AuthLayout.tsx'.
 */

const Footer = () => {
  return (
    <footer className="text-center text-secondary-color text-xs p-5 bg-[#212529]  ">
      <p>© 2025 Firefighter Persona 5 Version 1.0</p>
    </footer>
  );
};

export default Footer;