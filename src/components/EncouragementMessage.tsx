import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const encouragements = [
  "Une journée productive s'annonce ! 💪",
  "Votre expertise fait la différence ! ⭐",
  "Chaque intervention compte, merci pour votre engagement ! 🌟",
  "Votre professionnalisme est remarquable ! 👏",
  "Une intervention réussie = un client satisfait ! 🎯",
  "Vous êtes un maillon essentiel de l'équipe ! 🤝",
  "Votre travail améliore le quotidien des clients ! 🌈",
  "La qualité de service, c'est vous ! ✨",
  "Merci pour votre réactivité ! ⚡",
  "Votre savoir-faire est précieux ! 💎",
  "Ensemble vers l'excellence ! 🚀",
  "Chaque défi est une opportunité de briller ! 🌟",
  "Votre efficacité fait notre fierté ! 🏆",
  "Un technicien en or ! 🥇",
  "La satisfaction client, votre priorité ! 🎯",
  "Votre expertise fait la différence ! 💫",
  "Une équipe de champions ! 🌟",
  "La réussite est dans les détails ! 🔍",
  "Merci pour votre engagement quotidien ! 🙏",
  "Votre motivation est contagieuse ! ✨",
  "Un service client d'excellence ! 🌟",
  "Chaque intervention compte ! 💪",
  "La qualité avant tout ! ⭐",
  "Votre travail est remarquable ! 👊",
  "L'expertise au service du client ! 🎯",
  "Une équipe de pros ! 🏅",
  "La satisfaction client est votre ADN ! 🧬",
  "Merci pour votre disponibilité ! 🌟",
  "Votre énergie est inspirante ! ⚡",
  "Un service 5 étoiles ! ⭐⭐⭐⭐⭐"
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