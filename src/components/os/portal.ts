// The orb's "dive" sets this right before navigating to /work; the Work page
// reads it on first render to play the arrival-from-light intro. Module state survives
// client-side navigation, and a hard reload correctly resets it.
let entering = false;

export const markPortal = () => { entering = true; };
export const peekPortal = () => entering;   // safe to call during render
export const clearPortal = () => { entering = false; };
