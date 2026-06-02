import React, { useState, useEffect } from "react";

const NightLetterApp = () => {
  const [showLetter, setShowLetter] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [stars, setStars] = useState<any[]>([]);
  const [shootingStars, setShootingStars] = useState<any[]>([]);
  const [backgroundImage] = useState("");
  const [clouds, setClouds] = useState<any[]>([]);
  const [fireflies, setFireflies] = useState<any[]>([]);
  const [letterClosing, setLetterClosing] = useState(false);

  const questionText =
    "Hi, baby! Hear that Eenie Meenie playing? My love is flying your way with this song to kick that silly cold to the curb! I'm really worried about you and want you back to your normal self as fast as possible. This isn't just a letter flying across the screen — it's delivering digital vitamins, tons of warmth, and my biggest hugs. Feel better soon, sunshine!";

  useEffect(() => {
    const newStars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setStars(newStars);

    const newClouds = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      top: Math.random() * 50 + 5,
      size: Math.random() * 120 + 60,
      duration: Math.random() * 80 + 40,
      delay: Math.random() * 30,
    }));
    setClouds(newClouds);

    const newFireflies = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 60 + 20,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
    setFireflies(newFireflies);

    const timer = setTimeout(() => {
      setShowLetter(true);
    }, 10000);

    const cameraTimer = setTimeout(() => {
      // camera move placeholder
    }, 10000);

    const shootingStarInterval = setInterval(() => {
      const newShootingStar = {
        id: Date.now(),
        left: Math.random() * 80 + 10,
        top: Math.random() * 30,
      };
      setShootingStars((prev) => [...prev, newShootingStar]);

      setTimeout(() => {
        setShootingStars((prev) =>
          prev.filter((star) => star.id !== newShootingStar.id),
        );
      }, 2000);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(cameraTimer);
      clearInterval(shootingStarInterval);
    };
  }, []);

  useEffect(() => {
    if (letterOpen && displayedText.length < questionText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(questionText.slice(0, displayedText.length + 1));
      }, 100);
      return () => clearTimeout(timer);
    } else if (
      letterOpen &&
      displayedText.length === questionText.length &&
      !letterClosing
    ) {
      // Через 5 секунд после написания текста закрываем письмо
      setTimeout(() => {
        setLetterClosing(true);
        // Сразу скрываем открытое письмо
        setLetterOpen(false);
      }, 5000);
    }
  }, [letterOpen, displayedText, letterClosing]);

  useEffect(() => {
    let isPlaying = false;
    const audio = new Audio("/sean.mp3");
    audio.loop = true;

    const playAudio = async () => {
      if (isPlaying) return;
      try {
        await audio.play();
        isPlaying = true;
      } catch (error) {
        console.log(
          "Audio play failed (this is expected on first load due to user interaction policy):",
          error,
        );
      }
    };

    // Try to play audio immediately
    playAudio();

    // Also try to play audio on user interaction as a fallback
    const handleFirstInteraction = () => {
      playAudio();
      if (isPlaying) {
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
      }
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      audio.pause();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  const handleLetterClick = () => {
    if (!letterOpen) {
      setLetterOpen(true);
    }
  };



  return (
    <div id="app-page" className="relative w-full h-screen overflow-hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Parisienne&family=Dancing+Script:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950" />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0">
        {/* Северное сияние */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora aurora-1"></div>
          <div className="aurora aurora-2"></div>
          <div className="aurora aurora-3"></div>
        </div>

        {/* Облака */}
        {clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute opacity-20"
            style={{
              top: `${cloud.top}%`,
              left: "-20%",
              animation: `cloud-drift ${cloud.duration}s linear infinite ${cloud.delay}s`,
            }}
          >
            <div
              className="bg-white rounded-full blur-xl"
              style={{
                width: `${cloud.size}px`,
                height: `${cloud.size * 0.6}px`,
              }}
            />
          </div>
        ))}

        {/* Звёзды */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s infinite ${star.delay}s`,
            }}
          />
        ))}

        {/* Падающие звёзды */}
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animation: "shooting 2s ease-out",
              boxShadow: "0 0 4px 2px rgba(255, 255, 255, 0.8)",
            }}
          />
        ))}

        {/* Светлячки */}
        {fireflies.map((firefly) => (
          <div
            key={firefly.id}
            className="absolute rounded-full"
            style={{
              left: `${firefly.left}%`,
              top: `${firefly.top}%`,
              width: `${firefly.size}px`,
              height: `${firefly.size}px`,
              background:
                "radial-gradient(circle, rgba(255, 255, 150, 0.9) 0%, rgba(255, 255, 100, 0.3) 50%, transparent 70%)",
              animation: `firefly-glow ${firefly.duration}s ease-in-out infinite ${firefly.delay}s, firefly-float ${firefly.duration * 2}s ease-in-out infinite ${firefly.delay}s`,
              boxShadow: "0 0 10px 3px rgba(255, 255, 150, 0.6)",
              filter: "blur(0.5px)",
            }}
          />
        ))}

        {/* Горы, холм и дерево */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Дальние горы - высокие */}
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1200 500"
            preserveAspectRatio="none"
            style={{ height: "65vh" }}
          >
            <path
              d="M0,250 L150,150 L300,190 L450,130 L600,170 L750,120 L900,160 L1050,140 L1200,180 L1200,500 L0,500 Z"
              fill="rgba(30, 58, 138, 0.8)"
            />
            <path
              d="M0,300 L100,220 L250,260 L400,210 L550,250 L700,200 L850,240 L1000,220 L1200,260 L1200,500 L0,500 Z"
              fill="rgba(30, 58, 138, 0.6)"
            />
            <path
              d="M0,340 L150,280 L300,320 L450,270 L600,310 L750,260 L900,300 L1050,280 L1200,320 L1200,500 L0,500 Z"
              fill="rgba(30, 58, 138, 0.4)"
            />
          </svg>

          {/* Холм на переднем плане - высокий */}
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1200 350"
            preserveAspectRatio="none"
            style={{ height: "40vh" }}
          >
            <path
              d="M0,150 Q300,100 600,150 T1200,150 L1200,350 L0,350 Z"
              fill="rgba(15, 23, 42, 0.95)"
            />
            <path
              d="M0,200 Q300,160 600,200 T1200,200 L1200,350 L0,350 Z"
              fill="rgba(15, 23, 42, 1)"
            />
          </svg>

          {/* Трава на холме - выше */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                bottom: `${Math.random() * 25 + 15}%`,
                left: `${Math.random() * 100}%`,
                width: "2px",
                height: `${Math.random() * 30 + 20}px`,
                background:
                  "linear-gradient(to top, rgba(34, 197, 94, 0.5), transparent)",
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
              }}
            />
          ))}

          {/* Большое дерево на холме - чистый силуэт, адаптивное */}
          <svg
            className="absolute right-8 sm:right-16 bottom-0"
            width="200"
            height="400"
            viewBox="0 0 300 550"
            preserveAspectRatio="xMidYMax meet"
            style={{ height: "50vh", width: "auto" }}
          >
            {/* Ствол */}
            <rect
              x="135"
              y="320"
              width="30"
              height="230"
              fill="rgba(15, 23, 42, 1)"
              rx="5"
            />

            {/* Крона - простой силуэт */}
            <circle cx="150" cy="300" r="85" fill="rgba(15, 23, 42, 1)" />
            <circle cx="120" cy="260" r="70" fill="rgba(15, 23, 42, 1)" />
            <circle cx="180" cy="260" r="70" fill="rgba(15, 23, 42, 1)" />
            <circle cx="150" cy="220" r="75" fill="rgba(15, 23, 42, 1)" />
            <circle cx="110" cy="210" r="55" fill="rgba(15, 23, 42, 1)" />
            <circle cx="190" cy="210" r="55" fill="rgba(15, 23, 42, 1)" />
            <circle cx="150" cy="170" r="60" fill="rgba(15, 23, 42, 1)" />

            {/* Основные ветки */}
            <ellipse
              cx="90"
              cy="340"
              rx="25"
              ry="15"
              fill="rgba(15, 23, 42, 1)"
              transform="rotate(-30 90 340)"
            />
            <ellipse
              cx="210"
              cy="340"
              rx="25"
              ry="15"
              fill="rgba(15, 23, 42, 1)"
              transform="rotate(30 210 340)"
            />
            <ellipse
              cx="75"
              cy="380"
              rx="20"
              ry="12"
              fill="rgba(15, 23, 42, 1)"
              transform="rotate(-40 75 380)"
            />
            <ellipse
              cx="225"
              cy="380"
              rx="20"
              ry="12"
              fill="rgba(15, 23, 42, 1)"
              transform="rotate(40 225 380)"
            />
          </svg>
        </div>

        {/* Луна - адаптивная */}
        <div
          className="absolute top-10 sm:top-20 right-10 sm:right-20 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl"
          style={{
            animation:
              "pulse 3s ease-in-out infinite, float 4s ease-in-out infinite",
            boxShadow:
              "0 0 60px 20px rgba(147, 197, 253, 0.4), inset -8px -8px 20px rgba(191, 219, 254, 0.3)",
          }}
        >
          <div className="absolute top-2 left-3 w-3 h-3 sm:top-4 sm:left-6 sm:w-6 sm:h-6 rounded-full bg-blue-200/30" />
          <div className="absolute top-4 right-4 w-2 h-2 sm:top-8 sm:right-8 sm:w-4 sm:h-4 rounded-full bg-blue-200/40" />
          <div className="absolute bottom-5 left-5 w-2 h-2 sm:bottom-10 sm:left-10 sm:w-5 sm:h-5 rounded-full bg-blue-200/35" />
          <div className="absolute top-6 left-7 w-2 h-2 sm:top-12 sm:left-14 sm:w-3 sm:h-3 rounded-full bg-blue-200/25" />
          <div className="absolute bottom-3 right-3 w-3 h-3 sm:bottom-6 sm:right-6 sm:w-7 sm:h-7 rounded-full bg-blue-200/30" />
          <div className="absolute top-8 right-6 w-2 h-2 sm:top-16 sm:right-12 sm:w-4 sm:h-4 rounded-full bg-blue-200/20" />
          <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/20 to-transparent" />
        </div>

        {/* Дополнительные элементы в верхней части */}
        <div className="absolute top-10 left-10 w-24 h-24 opacity-20">
          <svg viewBox="0 0 100">
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="white"
              opacity="0.3"
              className="blur-xl"
            />
            <circle
              cx="70"
              cy="50"
              r="20"
              fill="white"
              opacity="0.2"
              className="blur-xl"
            />
          </svg>
        </div>

        <div className="absolute top-32 left-1/3 w-32 h-32 opacity-15">
          <svg viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="white"
              opacity="0.25"
              className="blur-2xl"
            />
          </svg>
        </div>

        {/* Дополнительные элементы в нижней части для баланса */}
        <div className="absolute bottom-1/3 right-1/4 w-28 h-28 opacity-15">
          <svg viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="white"
              opacity="0.2"
              className="blur-2xl"
            />
          </svg>
        </div>

        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 opacity-20">
          <svg viewBox="0 0 100 100">
            <circle
              cx="40"
              cy="40"
              r="30"
              fill="white"
              opacity="0.25"
              className="blur-xl"
            />
          </svg>
        </div>

        {/* Письмо */}
        {showLetter && !letterClosing && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: "letter-fade-in 2s ease-out" }}
          >
            <div className="animate-letter-entrance">
              {!letterOpen ? (
                <div
                  onClick={handleLetterClick}
                  className="relative cursor-pointer transform hover:scale-105 transition-transform"
                >
                  <div className="w-64 h-44 sm:w-80 sm:h-56 bg-gradient-to-br from-sky-300 to-sky-400 rounded-lg shadow-2xl shadow-blue-400/50 relative">
                    <div
                      className="absolute top-0 left-0 w-full h-20 sm:h-28 bg-gradient-to-br from-sky-400 to-sky-500 rounded-t-lg"
                      style={{
                        clipPath: "polygon(0 0, 50% 60%, 100% 0)",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-blue-900 text-lg sm:text-xl font-semibold tracking-wide px-6 sm:px-8 text-center mt-8 sm:mt-12">
                        Press me 💖
                      </p>
                    </div>
                    {/* Сердечко слева */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 border-blue-700 flex items-center justify-center bg-blue-50">
                      <span className="text-xl sm:text-2xl">❤️</span>
                    </div>

                    {/* Торт по центру - на 50% больше */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 sm:bottom-4 w-15 h-15 sm:w-18 sm:h-18 rounded-full border-3 sm:border-4 border-blue-700 flex items-center justify-center bg-blue-50">
                      <span className="text-xl sm:text-2xl">🍧</span>
                    </div>

                    {/* Роза справа */}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 border-blue-700 flex items-center justify-center bg-blue-50">
                      <span className="text-xl sm:text-2xl">🌹</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-[24rem] sm:w-[28.8rem] mx-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-2xl shadow-blue-500/50 p-6 sm:p-8 transform animate-unfold max-h-[80vh] overflow-y-auto">
                  <div className="flex flex-col items-center justify-center">
                    <p
                      className="text-xl sm:text-2xl text-blue-900 text-center pb-3 sm:pb-4 border-b-2 border-blue-300 mb-6"
                      style={{
                        fontFamily: "'Parisienne', 'Dancing Script', cursive",
                        lineHeight: "1.8",
                      }}
                    >
                      {displayedText}
                      {displayedText.length < questionText.length && (
                        <span className="animate-pulse">|</span>
                      )}
                    </p>

                    {/* Иконки появляются после написания текста */}
                    {displayedText.length === questionText.length && (
                      <div className="flex gap-6 sm:gap-8 mt-4 animate-fade-in">
                        {/* Сердечко */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 sm:border-4 border-blue-700 flex items-center justify-center bg-blue-50">
                          <span className="text-2xl sm:text-3xl">❤️</span>
                        </div>

                        {/* Торт */}
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-3 sm:border-4 border-blue-700 flex items-center justify-center bg-blue-50">
                          <span className="text-2xl sm:text-3xl">🍧</span>
                        </div>

                        {/* Роза */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 sm:border-4 border-blue-700 flex items-center justify-center bg-blue-50">
                          <span className="text-2xl sm:text-3xl">🌹</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Письмо улетает обратно */}
        {letterClosing && showLetter && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="animate-letter-exit"
              onAnimationEnd={() => setShowLetter(false)}
            >
              <div className="w-64 h-44 sm:w-80 sm:h-56 bg-gradient-to-br from-sky-300 to-sky-400 rounded-lg shadow-2xl shadow-blue-400/50 relative">
                <div
                  className="absolute top-0 left-0 w-full h-20 sm:h-28 bg-gradient-to-br from-sky-400 to-sky-500 rounded-t-lg"
                  style={{
                    clipPath: "polygon(0 0, 50% 60%, 100% 0)",
                  }}
                />
                {/* Текст на конверте */}
                <div className="absolute inset-0 flex items-center justify-center mt-8 sm:mt-12">
                  <p className="text-blue-900 text-lg sm:text-xl font-bold tracking-wide px-4 text-center">
                    Feel better soon ❤️, <br />
                    sunshine !!!
                  </p>
                  {/* Губы */}
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-10 h-10 sm:w-12 sm:h-12 mt-2"
                  >
                    {/* Верхняя губа */}
                    <path
                      d="M7 12C7 12 9 10 12 10C15 10 17 12 17 12C17 12 15 13 12 13C9 13 7 12 7 12Z"
                      fill="#dc2626"
                      stroke="#b91c1c"
                      strokeWidth="0.5"
                    />
                    {/* Нижняя губа */}
                    <path
                      d="M7 12C7 12 8 15 12 15C16 15 17 12 17 12C17 12 16 14 12 14C8 14 7 12 7 12Z"
                      fill="#ef4444"
                      stroke="#b91c1c"
                      strokeWidth="0.5"
                    />
                    {/* Блик на губах */}
                    <ellipse
                      cx="10"
                      cy="13"
                      rx="1.5"
                      ry="0.8"
                      fill="#fca5a5"
                      opacity="0.6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio element for background music */}
      <audio id="background-audio" loop style={{ display: "none" }}>
        <source src="/sakura.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes shooting {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes unfold {
          0% {
            transform: rotateX(90deg) scaleX(0.8);
            opacity: 0;
          }
          70% {
            transform: rotateX(10deg) scaleX(1.1);
          }
          100% {
            transform: rotateX(0deg) scaleX(1.2);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-unfold {
          animation: unfold 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        @keyframes cloud-drift {
          0% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(120vw);
          }
        }

        @keyframes firefly-glow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes firefly-float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        .aurora {
          position: absolute;
          width: 100%;
          height: 200px;
          filter: blur(40px);
          opacity: 0.3;
        }

        .aurora-1 {
          top: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(34, 211, 238, 0.4),
            rgba(59, 130, 246, 0.4),
            transparent
          );
          animation: aurora-wave 15s ease-in-out infinite;
        }

        .aurora-2 {
          top: 50px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(147, 51, 234, 0.3),
            rgba(59, 130, 246, 0.3),
            transparent
          );
          animation: aurora-wave 20s ease-in-out infinite 5s;
        }

        .aurora-3 {
          top: 100px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(59, 130, 246, 0.3),
            rgba(34, 211, 238, 0.3),
            transparent
          );
          animation: aurora-wave 18s ease-in-out infinite 10s;
        }

        @keyframes aurora-wave {
          0%,
          100% {
            transform: translateX(-50%) scaleY(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(50%) scaleY(1.5);
            opacity: 0.5;
          }
        }

        .camera-start {
          transform: translateY(60vh) scale(1);
        }

        .camera-move-up {
          transform: translateY(0) scale(1);
        }

        @media (max-width: 640px) {
          .camera-start {
            transform: translateY(50vh) scale(1);
          }

          .camera-move-up {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes letter-fade-in {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
        }

        @keyframes letter-entrance {
          0% {
            transform: translate(-100vw, -100vh) rotate(0deg) scale(0.1);
            opacity: 0;
          }
          30% {
            transform: translate(40vw, 30vh) rotate(180deg) scale(0.3);
            opacity: 1;
          }
          50% {
            transform: translate(-20vw, 20vh) rotate(360deg) scale(0.5);
            opacity: 1;
          }
          65% {
            transform: translate(15vw, -10vh) rotate(540deg) scale(0.7);
            opacity: 1;
          }
          78% {
            transform: translate(-8vw, 5vh) rotate(720deg) scale(0.85);
            opacity: 1;
          }
          88% {
            transform: translate(0, 0) rotate(720deg) scale(1.2);
            opacity: 1;
          }
          93% {
            transform: translate(0, 0) rotate(720deg) scale(0.9);
            opacity: 1;
          }
          97% {
            transform: translate(0, 0) rotate(720deg) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(0, 0) rotate(720deg) scale(1);
            opacity: 1;
          }
        }

        .animate-letter-entrance {
          animation: letter-entrance 10s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes letter-exit {
          0% {
            transform: translate(0, 0) rotate(720deg) scale(1);
            opacity: 1;
          }
          10% {
            transform: translate(0, 0) rotate(720deg) scale(0.9);
            opacity: 1;
          }
          20% {
            transform: translate(-8vw, 5vh) rotate(630deg) scale(0.85);
            opacity: 1;
          }
          35% {
            transform: translate(15vw, -10vh) rotate(540deg) scale(0.7);
            opacity: 1;
          }
          50% {
            transform: translate(-20vw, 20vh) rotate(360deg) scale(0.5);
            opacity: 1;
          }
          70% {
            transform: translate(40vw, 30vh) rotate(180deg) scale(0.3);
            opacity: 1;
          }
          90% {
            transform: translate(80vw, -60vh) rotate(45deg) scale(0.15);
            opacity: 0.5;
          }
          100% {
            transform: translate(150vw, -150vh) rotate(0deg) scale(0.05);
            opacity: 0;
          }
        }

        .animate-letter-exit {
          animation: letter-exit 10s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
          animation-fill-mode: forwards;
        }

        @keyframes headphones-appear {
          0% {
            transform: translateY(10px) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translateY(-5px) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .animate-headphones-appear {
          animation: headphones-appear 1s ease-out;
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.5);
          }
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        @keyframes note {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-20px);
            opacity: 0;
          }
        }

        .animate-note {
          animation: note 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NightLetterApp;
