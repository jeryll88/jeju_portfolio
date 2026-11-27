import { useState } from 'react';
import { motion } from 'framer-motion';

const INNER_TECHS = [
  { name: 'React.js', icon: '/tech-logos/react.svg', color: '#61DAFB' },
  { name: 'JavaScript', icon: '/tech-logos/javascript.svg', color: '#F7DF1E' },
  { name: 'Node.js', icon: '/tech-logos/nodejs.svg', color: '#339933' },
  { name: 'PHP', icon: '/tech-logos/php.svg', color: '#777BB4' },
  { name: 'HTML5', icon: '/tech-logos/html.svg', color: '#E34F26' },
  { name: 'Express.js', icon: '/tech-logos/express.svg', color: '#68A063' },
];

const OUTER_TECHS = [
  { name: 'CSS3', icon: '/tech-logos/css.svg', color: '#1572B6' },
  { name: 'Tailwind CSS', icon: '/tech-logos/tailwind.svg', color: '#06B6D4' },
  { name: 'MySQL', icon: '/tech-logos/mysql.svg', color: '#4479A1' },
  { name: 'MongoDB', icon: '/tech-logos/mongodb.svg', color: '#47A248' },
  { name: 'PostgreSQL', icon: '/tech-logos/postgresql.svg', color: '#4169E1' },
  { name: 'GitHub', icon: '/tech-logos/github.svg', color: '#F0F6FC', invertInLight: true },
];

export default function TechOrbit({ profileImageUrl, fullName }) {
  const [hoveredTech, setHoveredTech] = useState(null);

  const innerRadius = 114; // pixels
  const outerRadius = 178; // pixels

  return (
    <div className="relative w-full flex items-center justify-center py-6 select-none">
      {/* Outer ambient glow */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-primary/15 via-cyan-500/10 to-blue-600/15 blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Orbit Container with scale responsiveness */}
      <div className="tech-orbit-container relative w-[370px] h-[370px] sm:w-[430px] sm:h-[430px] flex items-center justify-center scale-[0.82] xs:scale-[0.9] sm:scale-100 transition-transform duration-300">
        
        {/* ─── OUTER ORBIT TRACK ─── */}
        <div
          className="absolute rounded-full border border-dashed border-slate-300/80 dark:border-blue-500/25 pointer-events-none"
          style={{
            width: `${outerRadius * 2}px`,
            height: `${outerRadius * 2}px`,
          }}
        />

        {/* Outer Orbit Rotating Arm */}
        <div
          className="tech-orbit-track-ccw absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ '--orbit-duration': '44s' }}
        >
          {OUTER_TECHS.map((tech, idx) => {
            const angle = (idx * 360) / OUTER_TECHS.length;
            const isHovered = hoveredTech === tech.name;

            return (
              <div
                key={tech.name}
                className="absolute flex items-center justify-center"
                style={{
                  transform: `rotate(${angle}deg) translate(${outerRadius}px) rotate(-${angle}deg)`,
                }}
              >
                {/* Counter-rotating element so icon stays upright */}
                <div
                  className="tech-orbit-item-ccw relative pointer-events-auto group/icon cursor-pointer"
                  style={{ '--orbit-duration': '44s' }}
                  onMouseEnter={() => setHoveredTech(tech.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md ${
                      isHovered
                        ? 'scale-125 z-40 bg-white dark:bg-black ring-2 ring-primary dark:ring-cyan-400 shadow-xl'
                        : 'bg-white/95 dark:bg-black border border-slate-200/90 dark:border-white/20 hover:border-primary/60 dark:hover:border-cyan-400/80'
                    }`}
                    style={
                      isHovered
                        ? {
                            borderColor: tech.color,
                            boxShadow: `0 0 22px ${tech.color}45, 0 8px 16px -4px rgba(0,0,0,0.3)`,
                          }
                        : {}
                    }
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className={`w-6 h-6 object-contain transition-transform duration-300 ${
                        isHovered ? 'scale-110' : ''
                      } ${tech.invertInLight ? 'dark:filter-none filter brightness-0' : ''}`}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Tooltip on hover */}
                  <div
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 z-50 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                    }`}
                  >
                    <div className="px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap bg-slate-900/95 text-white dark:bg-[#0B1120]/95 dark:text-cyan-300 border border-slate-700/80 shadow-2xl flex items-center gap-1.5 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tech.color }} />
                      {tech.name}
                    </div>
                    <div className="w-2 h-2 bg-slate-900/95 dark:bg-[#0B1120]/95 border-r border-b border-slate-700/80 transform rotate-45 mx-auto -mt-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── INNER ORBIT TRACK ─── */}
        <div
          className="absolute rounded-full border border-dashed border-slate-300/80 dark:border-cyan-500/25 pointer-events-none"
          style={{
            width: `${innerRadius * 2}px`,
            height: `${innerRadius * 2}px`,
          }}
        />

        {/* Inner Orbit Rotating Arm */}
        <div
          className="tech-orbit-track-cw absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ '--orbit-duration': '30s' }}
        >
          {INNER_TECHS.map((tech, idx) => {
            const angle = (idx * 360) / INNER_TECHS.length;
            const isHovered = hoveredTech === tech.name;

            return (
              <div
                key={tech.name}
                className="absolute flex items-center justify-center"
                style={{
                  transform: `rotate(${angle}deg) translate(${innerRadius}px) rotate(-${angle}deg)`,
                }}
              >
                {/* Counter-rotating element so icon stays upright */}
                <div
                  className="tech-orbit-item-cw relative pointer-events-auto group/icon cursor-pointer"
                  style={{ '--orbit-duration': '30s' }}
                  onMouseEnter={() => setHoveredTech(tech.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md ${
                      isHovered
                        ? 'scale-125 z-40 bg-white dark:bg-black ring-2 ring-primary dark:ring-cyan-400 shadow-xl'
                        : 'bg-white/95 dark:bg-black border border-slate-200/90 dark:border-white/20 hover:border-primary/60 dark:hover:border-cyan-400/80'
                    }`}
                    style={
                      isHovered
                        ? {
                            borderColor: tech.color,
                            boxShadow: `0 0 22px ${tech.color}45, 0 8px 16px -4px rgba(0,0,0,0.3)`,
                          }
                        : {}
                    }
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className={`w-6 h-6 object-contain transition-transform duration-300 ${
                        isHovered ? 'scale-110' : ''
                      }`}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Tooltip on hover */}
                  <div
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 z-50 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                    }`}
                  >
                    <div className="px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap bg-slate-900/95 text-white dark:bg-[#0B1120]/95 dark:text-cyan-300 border border-slate-700/80 shadow-2xl flex items-center gap-1.5 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tech.color }} />
                      {tech.name}
                    </div>
                    <div className="w-2 h-2 bg-slate-900/95 dark:bg-[#0B1120]/95 border-r border-b border-slate-700/80 transform rotate-45 mx-auto -mt-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── CENTER: ACTUAL PROFILE PICTURE CIRCULAR FRAME ─── */}
        <div className="relative z-20 flex items-center justify-center">
          {/* Futuristic pulse aura */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-primary via-cyan-400 to-blue-600 opacity-25 blur-lg animate-pulse-ring pointer-events-none" />

          {/* Decorative rotating accent ring */}
          <div className="absolute w-[138px] h-[138px] rounded-full border border-primary/30 dark:border-cyan-400/30 animate-spin-slow pointer-events-none">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
          </div>

          {/* Circular frame containing user's actual profile photo */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-primary via-cyan-400 to-blue-500 shadow-xl shadow-primary/25">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white dark:border-[#080C14]">
              <img
                src="/orbit-profile.jpg"
                alt={fullName || 'Jeryll Anne Bides'}
                className="w-full h-full object-cover object-[center_20%] select-none hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = profileImageUrl || '/profile.jpg';
                }}
              />
            </div>

            {/* Online / Active status beacon */}
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#080C14] shadow-md flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white dark:bg-emerald-200" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
