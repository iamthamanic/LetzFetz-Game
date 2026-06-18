/**
 * Glitch card prompts — exaggerated tech-art + fantasy creatures (10).
 * Location: src/services/cardArt/prompts/glitches.ts
 */
import { wrapHiggsfieldIllustrationPrompt } from '../styleGuide';

const GLITCH_STYLE =
  'extremely exaggerated cartoon tech-art glitch aesthetic, digital CRT static RGB split pixel corruption, fantasy creature hybrid, gritty Berlin alley, no text';

export const GLITCH_PROMPTS: Record<string, string> = {
  'glitch-riss': wrapHiggsfieldIllustrationPrompt(
    'massive reality tear ripping open in alley with RGB glitch static, horned pixel demon creature clawing out of dimensional rift crack, ' +
      'arena dimension fracture tech-art fantasy beast, ' + GLITCH_STYLE,
  ),
  'glitch-nein': wrapHiggsfieldIllustrationPrompt(
    'boost power-up card dissolving into static, exaggerated goblin tech gremlin creature angrily refusing with crossed arms digital denial aura, ' +
      'denied neon boost glitch burst, ' + GLITCH_STYLE,
  ),
  'glitch-kurzschluss': wrapHiggsfieldIllustrationPrompt(
    'electrical short circuit explosion, bound card sparking fried wires, tiny electric imp fantasy sprite zapped by overloaded cables smoke burst, ' +
      'cartoon voltage demon shorting out, ' + GLITCH_STYLE,
  ),
  'glitch-rueckkopplung': wrapHiggsfieldIllustrationPrompt(
    'audio feedback loop visualized as screaming sonic wave, damage ricocheting, bat-eared feedback gremlin fantasy creature howling into broken megaphone, ' +
      'squealing digital distortion rings, ' + GLITCH_STYLE,
  ),
  'glitch-empfang': wrapHiggsfieldIllustrationPrompt(
    'bad phone reception dead zone, broken antenna static bars, ghost signal wraith fantasy creature made of corrupted wifi waves blocking signal, ' +
      'pixelated no-signal spirit, ' + GLITCH_STYLE,
  ),
  'glitch-systemfehler': wrapHiggsfieldIllustrationPrompt(
    'literal funny cartoon blue system error freeze, bound card frozen corrupted pixel melt spirit, no text',
  ),
  'glitch-download': wrapHiggsfieldIllustrationPrompt(
    'illegal download torrent chaos, pirated glowing code streams, shady USB stick in alley, pirate demon fantasy creature made of stolen data packets hoarding files, ' +
      'exaggerated digital thief beast, ' + GLITCH_STYLE,
  ),
  'glitch-selbstschaden': wrapHiggsfieldIllustrationPrompt(
    'malware self-damage exe exploding on draw, harmful digital wound sparks, tiny self-sabotage imp fantasy creature stabbing itself with glitch dagger, ' +
      'corrupted virus imp burst, ' + GLITCH_STYLE,
  ),
  'glitch-datenleck': wrapHiggsfieldIllustrationPrompt(
    'urban drain outlet pipe Abfluss Ausgangsrohr in alley wall, glowing digital data files code pixels pouring streaming out of pipe leaking everywhere, ' +
      'data leak torrent spilling onto pavement puddle of information, exaggerated tech-art glitch, ' + GLITCH_STYLE,
  ),
  'glitch-absturz': wrapHiggsfieldIllustrationPrompt(
    'torrent data stream made of blue screens and error messages cascading falling off cliff edge like waterfall, ' +
      'BSOD windows error codes pixels pouring down cliff crash abyss, system crash Absturz exaggerated tech-art glitch, ' + GLITCH_STYLE,
  ),
};
