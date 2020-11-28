import { StyleSheet } from 'react-native';
import normalizeText from '../constants/normalizeText';
export const baseFontSize = 14;
export const baseSpacing = 16;

export const style = StyleSheet.create({
    fontSizeSmall: { fontSize: 14 },
    fontSizeSmall1x: { fontSize: 15 },
    fontSizeNormal: { fontSize: 16 },
    fontSizeNormal1x: { fontSize: 17 },
    fontSizeMedium: { fontSize: 18 },
    fontSizeLarge: { fontSize: 20 },
    fontSizeExtraLarge: { fontSize: 35 },
    fontWeightThin: { fontWeight: '400' },
    fontWeightMedium: { fontWeight: '600' },
    fontWeightBold: { fontWeight: '800' },
    fontWeightBlack: { fontWeight: '900' },
    textShadow: { textShadowColor: 'rgba(0, 0, 0, 0.25)', textShadowRadius: 1, textShadowOffset: { width: 1, height: 1 } },
});

export const spacings = {
    none: 0,
    xxsmall: normalizeText(baseSpacing * 0.25),
    xsmall: normalizeText(baseSpacing * 0.5),
    small: normalizeText(baseSpacing * 0.75),
    small2x: normalizeText(baseSpacing * 0.75) +2,
    normal: normalizeText(baseSpacing),
    medium: normalizeText(baseSpacing * 1.5),
    large: normalizeText(baseSpacing * 2),
    xLarge: normalizeText(baseSpacing * 2.5),
    xxLarge: normalizeText(baseSpacing * 3),
    xxxLarge: normalizeText(baseSpacing * 3.5),
    xxxxLarge: normalizeText(baseSpacing * 4),
  };