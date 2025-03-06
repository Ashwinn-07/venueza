import { Shield, Calendar, CreditCard, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Premium Venues",
    description: "Access to exclusive and verified venues",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Seamless scheduling and confirmation",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe and transparent transactions",
  },
  {
    icon: MessageCircle,
    title: "Instant Chat",
    description: "Direct communication with venues",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 md:mb-16">
          Why Choose us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl transition duration-300 hover:bg-gray-50 text-center sm:text-left"
            >
              <div className="mb-4 inline-block p-3 rounded-lg bg-gray-50 group-hover:bg-white transition duration-300">
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-[#F4A261]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
