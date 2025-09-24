import React, { useRef } from 'react';
import './Footer.css';
import Lottie from 'lottie-react';
import githubLottie from '../../assets/github.json';
import linkedinLottie from '../../assets/linkedin.json';
import instagramLottie from '../../assets/instagram.json';

const Footer = () => {
  const githubRef = useRef();
  const linkedinRef = useRef();
  const instagramRef = useRef();

  const handleMouseEnter = (ref) => {
    if (ref.current) {
      ref.current.goToAndPlay(0, true);
    }
  };
  const handleMouseLeave = (ref) => {
    if (ref.current) {
      ref.current.goToAndStop(0, true);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 Excel Vision. All rights reserved.  </p>
        <div className="footer-socials">
          

          <a
            href="https://www.linkedin.com/in/vikas-yadav-4510242a4/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon linkedin"
            aria-label="LinkedIn"
            onMouseEnter={() => handleMouseEnter(linkedinRef)}
            onMouseLeave={() => handleMouseLeave(linkedinRef)}
          >
            <Lottie
              lottieRef={linkedinRef}
              loop
              animationData={linkedinLottie}
              style={{ height: 24, width: 24 }}
              autoplay={false}
            />
          </a>

          <a
            href="https://github.com/VIKASYADAV1815/vikas.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon github"
            aria-label="GitHub"
            onMouseEnter={() => handleMouseEnter(githubRef)}
            onMouseLeave={() => handleMouseLeave(githubRef)}
          >
            <Lottie
              lottieRef={githubRef}
              loop
              animationData={githubLottie}
              style={{ height: 24, width: 24 }}
              autoplay={false}
            />
          </a>
          <a
            href="https://www.instagram.com/vikasthatics/profilecard/?igsh=azU1eXhlMWJoZGZ4"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon instagram"
            aria-label="Instagram"
            onMouseEnter={() => handleMouseEnter(instagramRef)}
            onMouseLeave={() => handleMouseLeave(instagramRef)}
          >
            <Lottie
              lottieRef={instagramRef}
              loop
              animationData={instagramLottie}
              style={{ height: 24, width: 24 }}
              autoplay={false}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
