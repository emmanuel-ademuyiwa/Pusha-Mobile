import {SvgXml} from 'react-native-svg'

const CautionIcon = ({size = 70}) => {
  const svgString = `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Background shadow -->
  <ellipse cx="50" cy="88" rx="35" ry="8" fill="#00000020" />
  
  <!-- Outer circle (darker for depth) -->
  <circle cx="50" cy="50" r="40" fill="#E65100" />
  
  <!-- 3D effect - darker bottom part -->
  <path d="M 10 50 A 40 40 0 0 0 50 90 A 40 40 0 0 0 90 50 Z" fill="#BF360C" />
  
  <!-- Main circle with gradient -->
  <defs>
    <radialGradient id="orangeGradient" cx="0.3" cy="0.3" r="0.8">
      <stop offset="0%" style="stop-color:#FFB74D;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#FF9800;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E65100;stop-opacity:1" />
    </radialGradient>
    
    <!-- Highlight gradient -->
    <radialGradient id="highlight" cx="0.3" cy="0.3" r="0.6">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.4" />
      <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Main circle -->
  <circle cx="50" cy="50" r="37" fill="url(#orangeGradient)" />
  
  <!-- Highlight for 3D effect -->
  <circle cx="50" cy="50" r="37" fill="url(#highlight)" />
  
  <!-- Exclamation mark background (shadow) -->
  <rect x="47" y="25" width="6" height="25" rx="3" fill="#BF360C" />
  <circle cx="50" cy="58" r="4" fill="#BF360C" />
  
  <!-- Exclamation mark -->
  <rect x="46" y="24" width="8" height="26" rx="4" fill="#FFFFFF" />
  <rect x="47" y="25" width="6" height="24" rx="3" fill="#FFF3E0" />
  
  <!-- Exclamation dot -->
  <circle cx="50" cy="57" r="5" fill="#FFFFFF" />
  <circle cx="50" cy="57" r="4" fill="#FFF3E0" />
  
  <!-- Inner highlight on exclamation -->
  <rect x="47" y="25" width="2" height="20" rx="1" fill="#FFFFFF" opacity="0.7" />
  <ellipse cx="49" cy="57" rx="1.5" ry="1" fill="#FFFFFF" opacity="0.7" />
  
  <!-- Subtle inner shadow -->
  <circle cx="50" cy="50" r="37" fill="none" stroke="#BF360C" stroke-width="0.5" opacity="0.3" />
</svg>`

  return <SvgXml xml={svgString} width={size} height={size} />
}

export default CautionIcon