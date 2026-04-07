import * as React from 'react'
import Svg, {ClipPath, Defs, G, Path, SvgProps} from 'react-native-svg'
const GoogleIcon = (props: SvgProps) => (
  <Svg width={24} height={25} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="#4285F4"
        d="M23.766 12.909c0-.816-.066-1.636-.207-2.439H12.24v4.621h6.482a5.554 5.554 0 0 1-2.399 3.647v2.998h3.867c2.27-2.09 3.576-5.176 3.576-8.827Z"
      />
      <Path
        fill="#34A853"
        d="M12.24 24.633c3.236 0 5.966-1.063 7.954-2.897l-3.867-2.998c-1.075.732-2.464 1.146-4.083 1.146-3.13 0-5.785-2.112-6.737-4.951h-3.99v3.09a12.002 12.002 0 0 0 10.723 6.61Z"
      />
      <Path
        fill="#FBBC04"
        d="M5.503 14.932a7.188 7.188 0 0 1 0-4.594v-3.09H1.516a12.01 12.01 0 0 0 0 10.775l3.987-3.09Z"
      />
      <Path
        fill="#EA4335"
        d="M12.24 5.382a6.52 6.52 0 0 1 4.603 1.799l3.426-3.426A11.533 11.533 0 0 0 12.24.633 11.998 11.998 0 0 0 1.516 7.247l3.987 3.091c.948-2.844 3.606-4.956 6.737-4.956Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .632h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default GoogleIcon
