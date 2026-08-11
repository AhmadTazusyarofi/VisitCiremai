export function GlassFilter() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
      <filter id="lg-glass" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves={2} seed={7} result="noise" />
        {/* Red channel — largest displacement */}
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={46} xChannelSelector="R" yChannelSelector="G" result="disR" />
        <feColorMatrix in="disR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        {/* Green channel — mid displacement */}
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={40} xChannelSelector="R" yChannelSelector="G" result="disG" />
        <feColorMatrix in="disG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        {/* Blue channel — smallest displacement */}
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={34} xChannelSelector="R" yChannelSelector="G" result="disB" />
        <feColorMatrix in="disB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feBlend in="red" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blue" mode="screen" />
      </filter>
    </svg>
  )
}
