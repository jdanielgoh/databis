import "./Footer.scss"
import behance from "../../assets/imgs/iconos/behance.svg";
import twitter from "../../assets/imgs/iconos/twitter.svg";
import instagram from "../../assets/imgs/iconos/instagram.svg";

import viteLogo from "/vite.svg";
const Footer = () => {
  return (
    <footer className="contenedor">
      <div className="ancho-max">
        <div className="contenedor">
          <div className="hecho">
            <a href="https://tirandocodigo.mx/" className="marca">
              <strong>Tirando Código</strong>
            </a>

            <p>
              Hecho con amor por su servidor, para México y el mundo, Daniel
              Gómez Hernández &#x1F495;
            </p>
            <ul>
              <li>
                <a href="https://tirandocodigo.mx/"> Inicio </a>
              </li>
              <li>
                <a href="https://tirandocodigo.mx/portafolio"> Portafolio </a>
              </li>
              <li>
                <a href="https://tirandocodigo.mx/tirando-codigo">
                  {" "}
                  Tirando.código{" "}
                </a>
              </li>
            </ul>
            <p className="header"></p>
          </div>
          <div className="contacto">
            <p>
              <strong> Contacto </strong>
            </p>

            <p>Redes</p>
            <div className="contenedor">
              <a
                href="https://www.instagram.com/tirando.codigo/"
                target="_blank"
              >
                <img src={instagram} alt="instagram" />
              </a>
              <a href="https://twitter.com/jdanielgoh" target="_blank">
                <img src={twitter} alt="twitter" />
              </a>
              <a href="https://www.behance.net/jdanielgoh8508" target="_blank">
                <img src={behance} alt="behance" />
              </a>
            </div>
            <p>Correo</p>
            <p>
              <a href="mailto: gomezhernandez.dan@gmail.com">
                gomezhernandez.dan@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
