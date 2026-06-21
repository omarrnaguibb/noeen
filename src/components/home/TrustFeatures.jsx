import {
  FaClock,
  FaShieldHalved,
  FaRotateLeft,
  FaCartShopping,
  FaWhatsapp,
  FaStar,
} from "react-icons/fa6";

const ICON_MAP = {
  "sicon-watch": FaClock,
  "sicon-shield-check": FaShieldHalved,
  "sicon-refund": FaRotateLeft,
  "sicon-cart2": FaCartShopping,
  "sicon-whatsapp2": FaWhatsapp,
  "sicon-star-o": FaStar,
};

function FeatureIcon({ iconClass }) {
  const Icon = ICON_MAP[iconClass] ?? FaStar;
  return <Icon className="text-2xl text-primary" />;
}

export function TrustFeatures({ items }) {
  return (
    <section className="store-container py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <FeatureIcon iconClass={item.icon} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
            <p className="text-sm leading-7 text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProcessSteps({ items }) {
  return (
    <section className="store-container py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="relative rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm"
          >
            <span className="absolute top-4 start-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {index + 1}
            </span>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <FeatureIcon iconClass={item.icon} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
            <p className="text-sm leading-7 text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
