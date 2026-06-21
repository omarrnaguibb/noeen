import {
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import AppLink from "../AppLink";
import { useHomepageContent } from "../../context/LanguageContext";

const SOCIAL_ICONS = {
  instagram: FaInstagram,
  twitter: FaXTwitter,
  snapchat: FaSnapchat,
  tiktok: FaTiktok,
};

export default function StoreFooter() {
  const { FOOTER, STORE } = useHomepageContent();

  return (
    <footer className="mt-8 border-t border-gray-100 bg-gray-50 sm:mt-16">
      <div className="store-container py-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <img
            src={FOOTER.logo || STORE.logo}
            alt={FOOTER.logoAlt || STORE.name}
            className="mb-4 max-h-[80px] max-w-[220px] object-contain"
          />
          {FOOTER.about && (
            <p className="max-w-2xl text-sm leading-7 text-gray-600">{FOOTER.about}</p>
          )}
          {FOOTER.socialLinks?.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {FOOTER.socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform] ?? FaInstagram;
                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm hover:text-primary"
                    aria-label={social.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {FOOTER.policyLinks?.length > 0 && (
            <div>
              <h3 className="mb-4 text-base font-bold text-gray-900">
                {FOOTER.importantLinksTitle}
              </h3>
              <ul className="space-y-2">
                {FOOTER.policyLinks.map((link) => (
                  <li key={link.href}>
                    <AppLink href={link.href} className="text-sm text-gray-600 hover:text-primary">
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {FOOTER.contacts?.length > 0 && (
            <div>
              <h3 className="mb-4 text-base font-bold text-gray-900">{FOOTER.contactTitle}</h3>
              <ul className="space-y-2">
                {FOOTER.contacts.map((contact) => (
                  <li key={contact.href}>
                    <a
                      href={contact.href}
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      {contact.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {FOOTER.payments?.length > 0 && (
            <div>
              <h3 className="mb-4 text-base font-bold text-gray-900">&nbsp;</h3>
              <div className="flex flex-wrap gap-2">
                {FOOTER.payments.map((payment) => (
                  <img
                    key={payment.image}
                    src={payment.image}
                    alt={payment.alt}
                    className="h-10 w-10 object-contain"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 py-6">
        <div className="store-container text-center text-sm text-gray-500">
          {FOOTER.copyright}
        </div>
      </div>
    </footer>
  );
}
