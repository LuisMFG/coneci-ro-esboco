import React from "react";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="text-white relative"
      style={{
        background:
          "linear-gradient(to right, #0033A0 0%, #0033A0 10%, #009739 90%, #CCCC0A 102%)",
      }}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="images\conecii logoo branca (1).png"
                alt="Logo"
                className="w-40 h-auto object-contain"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-white/70">
                <MapPin className="h-5 w-5" />
                <span>Porto Velho, RO</span>
              </li>
              <li className="flex items-center space-x-3 text-white/70">
                <Mail className="h-5 w-5" />
                <span>???</span>
              </li>
              <li className="flex items-center space-x-3 text-white/70">
                <Phone className="h-5 w-5" />
                <span>???</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Redes Sociais</h3>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "Youtube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              &copy; {currentYear} CONECI-RO. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors duration-300"
              >
                Política de Privacidade
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors duration-300"
              >
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
