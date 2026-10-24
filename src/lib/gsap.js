/* =========================================================
   GSAP — single registration point.

   Import { gsap, ScrollTrigger, ... } from '../lib/gsap.js'
   everywhere. Registering plugins in more than one module is
   how you end up with two ScrollTrigger instances fighting
   over the same scroller.
   ========================================================= */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, CustomEase);

/* Signature eases. Named so the motion vocabulary stays consistent
   across every section instead of each file inventing its own curve. */
CustomEase.create('volt', 'M0,0 C0.12,0 0.08,1 1,1');          // decisive, heavy settle
CustomEase.create('swift', 'M0,0 C0.25,0.1 0.25,1 1,1');        // general purpose
CustomEase.create('curtain', 'M0,0 C0.65,0 0.35,1 1,1');        // symmetric wipe

gsap.defaults({ ease: 'volt', duration: 0.9 });

/* Never let a single bad trigger take down the whole page. */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, CustomEase };
