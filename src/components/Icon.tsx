import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export type IconName = 'camera' | 'sparkle' | 'bolt' | 'shield' | 'check' | 'checkCircle' | 'chevronR' | 'chevronL' | 'close' | 'warning' | 'pin' | 'user' | 'plus' | 'star' | 'arrowR' | 'arrowUpR' | 'info' | 'image' | 'clock' | 'chat' | 'wrench' | 'home' | 'homeFill' | 'doc' | 'docFill' | 'chatFill' | 'person' | 'personFill' | 'bell' | 'receipt' | 'shield-checkmark' | 'checkmark' | 'notifications';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export function Icon({ name, size = 22, color = '#000', strokeWidth = 1.9, style }: IconProps) {
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  
  const paths: Record<string, React.ReactNode> = {
    camera: <><Path {...p} d="M3 8.5A2 2 0 0 1 5 6.5h2l1.2-1.8A1 1 0 0 1 9 4.2h6a1 1 0 0 1 .8.5L17 6.5h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><Circle {...p} cx="12" cy="13" r="3.4"/></>,
    sparkle: <><Path {...p} d="M12 3.5l1.8 4.7L18.5 10l-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8z"/><Path {...p} d="M18.5 3.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/></>,
    bolt: <Path d="M12 2.5L5 13.2h5.2L9 21.5l8-11.2h-5.4z" fill={color} stroke="none"/>,
    shield: <><Path {...p} d="M12 3l7 2.5v5.2c0 4.6-3 8-7 9.8-4-1.8-7-5.2-7-9.8V5.5z"/><Path {...p} d="M9 12l2 2 4-4.2"/></>,
    check: <Path {...p} d="M5 12.5l4.2 4.2L19 7"/>,
    checkCircle: <><Circle {...p} cx="12" cy="12" r="9"/><Path {...p} d="M8 12.2l2.6 2.6L16 9.2"/></>,
    chevronR: <Path {...p} d="M9 5l7 7-7 7"/>,
    chevronL: <Path {...p} d="M15 5l-7 7 7 7"/>,
    close: <Path {...p} d="M6 6l12 12M18 6L6 18"/>,
    warning: <><Path {...p} d="M12 4.5l8.5 14.7H3.5z"/><Path {...p} d="M12 10v4"/><Circle cx="12" cy="16.6" r="1.1" fill={color} stroke="none"/></>,
    pin: <><Path {...p} d="M12 21c4-4 6.5-7 6.5-10.3A6.5 6.5 0 0 0 5.5 10.7C5.5 14 8 17 12 21z"/><Circle {...p} cx="12" cy="10.5" r="2.4"/></>,
    user: <><Circle {...p} cx="12" cy="8.5" r="3.6"/><Path {...p} d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/></>,
    plus: <Path {...p} d="M12 5.5v13M5.5 12h13"/>,
    star: <Path d="M12 3.5l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.5 6.9 19.2l1-5.7-4.1-4 5.7-.8z" fill={color} stroke="none"/>,
    arrowR: <Path {...p} d="M5 12h14M13 6l6 6-6 6"/>,
    arrowUpR: <Path {...p} d="M7 17L17 7M8 7h9v9"/>,
    info: <><Circle {...p} cx="12" cy="12" r="9"/><Path {...p} d="M12 11v5"/><Circle cx="12" cy="7.8" r="1" fill={color} stroke="none"/></>,
    image: <><Rect {...p} x="3.5" y="4.5" width="17" height="15" rx="3"/><Circle {...p} cx="8.5" cy="9.5" r="1.6"/><Path {...p} d="M4 17l4.5-4 3 2.6L15 11l5 5"/></>,
    clock: <><Circle {...p} cx="12" cy="12" r="8.5"/><Path {...p} d="M12 7.5V12l3 1.8"/></>,
    chat: <Path {...p} d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5z"/>,
    wrench: <Path {...p} d="M15.5 7a3.5 3.5 0 0 1-4.6 4.3L5.5 16.7a1.8 1.8 0 0 0 2.5 2.5l5.4-5.4A3.5 3.5 0 0 0 18 9.2l-2.2 2.2-2-2L16 7.2A3.5 3.5 0 0 0 15.5 7z"/>,
    home: <Path {...p} d="M4 11.2L12 4.5l8 6.7M6 9.6V19h4.2v-5.2h3.6V19H18V9.6"/>,
    homeFill: <Path d="M12 3.6L3.4 10.9c-.3.3-.1.8.3.8H6V19a1 1 0 0 0 1 1h3v-5.4h4V20h3a1 1 0 0 0 1-1v-7.3h2.3c.4 0 .6-.5.3-.8z" fill={color} stroke="none"/>,
    doc: <><Path {...p} d="M7 3.5h6.5L18 8v12.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><Path {...p} d="M13 3.5V8h4M9 12.5h6M9 16h4"/></>,
    docFill: <><Path d="M7 2.8h6.2L18.2 8v12.2a1.6 1.6 0 0 1-1.6 1.6H7a1.6 1.6 0 0 1-1.6-1.6V4.4A1.6 1.6 0 0 1 7 2.8z" fill={color} stroke="none"/><Path d="M13 2.8V8h4.8M9.2 12.4h5.6M9.2 16h3.6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></>,
    chatFill: <Path d="M5 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.2 3.1A.6.6 0 0 1 5 19.1V16.5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" fill={color} stroke="none"/>,
    person: <><Circle {...p} cx="12" cy="8" r="3.8"/><Path {...p} d="M5 20c0-3.7 3-6.2 7-6.2s7 2.5 7 6.2"/></>,
    personFill: <><Circle cx="12" cy="8" r="4" fill={color} stroke="none"/><Path d="M4.5 20.5c0-4 3.4-6.6 7.5-6.6s7.5 2.6 7.5 6.6z" fill={color} stroke="none"/></>,
    bell: <><Path {...p} d="M6 9a6 6 0 0 1 12 0c0 5 1.6 6.5 1.6 6.5H4.4S6 14 6 9z"/><Path {...p} d="M10 19a2 2 0 0 0 4 0"/></>,
    receipt: <><Path {...p} d="M6 3.5h12v17l-2.2-1.4-2 1.4-1.8-1.4-1.8 1.4-2-1.4L6 20.5z"/><Path {...p} d="M9 8h6M9 11.5h6M9 15h4"/></>,
    
    // aliases from Ionicons used earlier
    'shield-checkmark': <><Path {...p} d="M12 3l7 2.5v5.2c0 4.6-3 8-7 9.8-4-1.8-7-5.2-7-9.8V5.5z"/><Path {...p} d="M9 12l2 2 4-4.2"/></>,
    'checkmark': <Path {...p} d="M5 12.5l4.2 4.2L19 7"/>,
    'notifications': <><Path {...p} d="M6 9a6 6 0 0 1 12 0c0 5 1.6 6.5 1.6 6.5H4.4S6 14 6 9z"/><Path {...p} d="M10 19a2 2 0 0 0 4 0"/></>,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {paths[name] || null}
    </Svg>
  );
}
