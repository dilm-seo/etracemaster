import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const encouragements = [
  "Bravo à vous ! 👏",
  "Vous êtes au top ! 💯",
  "Merci pour tout ! 🙏",
  "Toujours efficace ! 🚀",
  "Super boulot ! ⭐",
  "Quelle énergie ! ⚡",
  "Votre talent brille ! ✨",
  "On vous admire ! 🌟",
  "Rien ne vous arrête ! 💪",
  "Parfait, comme toujours ! 🥇",
  "Merci d'être là ! 🤝",
  "Vous êtes incroyable ! 💥",
  "Excellence garantie ! 🏆",
  "Toujours au rendez-vous ! ⏰",
  "Votre rigueur est inspirante ! 🎯",
  "Top réactivité ! ⚡",
  "Bravo pour l'effort ! 💪",
  "Toujours positif ! 😊",
  "Inarrêtable ! 💥",
  "Merci pour votre aide ! 🤗",
  "Vous faites la différence ! 🌈",
  "Toujours un plaisir ! 🌞",
  "Vous êtes essentiel ! 🛠️",
  "Merci de foncer ! 🚀",
  "Toujours présent ! 💯",
  "Votre attitude inspire ! ✨",
  "Quelle persévérance ! 🏅",
  "Excellent travail ! 💪",
  "Vous êtes en or ! 🥇",
  "Merci pour votre sourire ! 😊",
  "Toujours là pour nous ! 💖",
  "Impressionnant boulot ! 🏆",
  "Votre réactivité est top ! ⚡",
  "Toujours un gagnant ! 🏆",
  "Merci pour l'efficacité ! 🚀",
  "Vous assurez ! 💥",
  "Un vrai pro ! 🥇",
  "Vous êtes inspirant ! 🌟",
  "Toujours à fond ! 🔥",
  "Bravo, quel talent ! 💡",
  "Votre impact est immense ! 🌍",
  "Merci pour votre énergie ! ⚡",
  "Vous êtes exceptionnel ! ✨",
  "Toujours fiable ! 🤝",
  "Bravo pour la qualité ! ⭐",
  "Toujours brillant ! 🌟",
  "Un service parfait ! 💯",
  "Merci pour tout ça ! 🙏",
  "Vous êtes notre force ! 💥",
  "On peut compter sur vous ! 🤗",
  "Toujours motivé ! 🚀",
  "Quelle efficacité ! 🎯",
  "Bravo pour l'engagement ! 💪",
  "Votre esprit est exemplaire ! 🌞",
  "Vous inspirez la confiance ! 🤝",
  "Toujours plus haut ! 🌠",
  "Merci pour l'attention ! 🔍",
  "Un modèle de persévérance ! 🏅",
  "Toujours brillant ! 💎",
  "Vous faites la magie ! ✨",
  "Inspiration au quotidien ! 🌟",
  "Toujours avec le sourire ! 😊",
  "Un vrai atout ! 💡",
  "Vos efforts paient ! 🏆",
  "Merci pour votre force ! 💪",
  "Vous êtes indispensable ! 🛠️",
  "Quelle classe ! ✨",
  "Votre savoir-faire est top ! 💯",
  "Toujours à l'écoute ! 👂",
  "Bravo, vous excellez ! 🥇",
  "Votre courage inspire ! 💥",
  "Merci pour la passion ! 🔥",
  "Vous êtes unique ! 🌟",
  "Jamais à court d'idées ! 💡",
  "Merci pour l'esprit d'équipe ! 🤝",
  "Toujours une solution ! 🛠️",
  "Vous êtes la clé du succès ! 🔑",
  "Quelle détermination ! 💪",
  "Bravo, quelle patience ! ⏳",
  "Toujours un plaisir de travailler ensemble ! 🤗",
  "Votre travail est exemplaire ! ⭐",
  "Vous êtes une vraie force ! 💥",
  "Toujours sur le terrain ! 🚀",
  "Merci pour l'implication ! 🌟",
  "Un vrai champion ! 🏆",
  "Votre dévouement est apprécié ! 🙏",
  "Toujours à la hauteur ! 📈",
  "Bravo pour la précision ! 🔍",
  "Quelle performance ! 🏅",
  "Merci pour l'écoute ! 👂",
  "Votre gentillesse est précieuse ! 💖",
  "Bravo, quel dévouement ! 💥",
  "Merci d'être aussi pro ! 🎯",
  "Votre énergie est communicative ! 🌞",
  "Vous êtes une vraie pépite ! 💎",
  "Merci de ne jamais lâcher ! 🏋️",
];

export function EncouragementMessage() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const updateMessage = () => {
      setFadeOut(true);
      setTimeout(() => {
        setMessage(encouragements[Math.floor(Math.random() * encouragements.length)]);
        setFadeOut(false);
      }, 500);
    };

    updateMessage();
    const interval = setInterval(updateMessage, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className={`bg-slate-800/95 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg border border-white/10
        transition-all duration-500 transform
        ${fadeOut ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <p className="text-sm text-white">{message}</p>
        </div>
      </div>
    </div>
  );
}
