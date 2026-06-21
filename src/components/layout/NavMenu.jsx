import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import AppLink from "../AppLink";

export function DesktopNavMenu({ navLinks }) {
  return (
    <ul className="main-menu hidden w-full flex-wrap items-center justify-center gap-0.5 py-3 lg:flex">
      {navLinks.map((link) => {
        const hasChildren = link.children?.length > 0;
        const linkClass =
          link.id === "offers"
            ? "offers-link rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            : "rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-primary/5 hover:text-primary";

        if (!hasChildren) {
          return (
            <li key={link.id} id={link.id} className="root-level">
              <AppLink href={link.href} className={linkClass}>
                {link.label}
              </AppLink>
            </li>
          );
        }

        return (
          <li key={link.id} id={link.id} className="root-level group relative has-children flex items-center gap-x-1">
            <button type="button" className={`${linkClass} inline-flex cursor-default items-center gap-1`}>
              {link.label}
            </button>
            <FaChevronDown className="pointer-events-none absolute top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 text-gray-400 group-hover:text-primary ltr:right-1 rtl:left-1 lg:inline" />
            <div className="sub-menu pointer-events-none absolute top-full z-50 mt-1 min-w-56 rounded-lg border border-gray-100 bg-white py-2 opacity-0 shadow-lg transition group-hover:pointer-events-auto group-hover:opacity-100 ltr:left-0 rtl:right-0">
              <ul>
                {link.children.map((child) => (
                  <li key={child.id} id={child.id} className="relative">
                    <AppLink
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 transition hover:bg-primary/5 hover:text-primary"
                    >
                      {child.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function MobileNavMenu({ navLinks, onNavigate, viewAllLabel }) {
  const [openId, setOpenId] = useState(null);

  const toggleParent = (event, linkId) => {
    event.preventDefault();
    setOpenId((current) => (current === linkId ? null : linkId));
  };

  return (
    <ul className="main-menu">
      {navLinks.map((link) => {
        const hasChildren = link.children?.length > 0;
        const isOpen = openId === link.id;
        const toggleId = `toggle-container-${link.id}`;

        if (hasChildren) {
          return (
            <li
              key={link.id}
              id={link.id}
              className={`root-level has-children slide-toggler mobile-accordion ${isOpen ? "is-open" : ""}`}
            >
              <AppLink
                href={link.href}
                className="collapsible-title"
                data-container={toggleId}
                onClick={(event) => toggleParent(event, link.id)}
              >
                <span>{link.label}</span>
              </AppLink>

              <div
                className={`mobile-collapsible sub-menu lg:w-56 ${isOpen ? "is-open" : ""}`}
                id={toggleId}
              >
                <ul>
                  <li className="lg:hidden">
                    <AppLink href={link.href} onClick={onNavigate}>
                      <span>{viewAllLabel}</span>
                    </AppLink>
                  </li>
                  {link.children.map((child) => (
                    <li key={child.id} id={child.id} className="relative">
                      <AppLink href={child.href} className="collapsible-title" onClick={onNavigate}>
                        <span>{child.label}</span>
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        }

        const linkClass = link.id === "offers" ? "offers-link" : "collapsible-title";

        return (
          <li key={link.id} id={link.id} className="root-level">
            <AppLink href={link.href} className={linkClass} onClick={onNavigate}>
              <span>{link.label}</span>
            </AppLink>
          </li>
        );
      })}
    </ul>
  );
}
