import { Readable, writable } from "svelte/store";

export interface Tweened extends Readable<number> {
  set(value: number, duration: number): void;
}

export function tween(init: number): Tweened {
  const store = writable(init);
  let newPos = init;

  function set(targetPos: number, duration: number): void {
    const startPos = newPos;
    const start = window.performance.now();
    const dist = (t) => startPos + t * (targetPos - startPos);

    const animate = (ts: number) => {
      const t = (ts - start) / duration;
      if (t >= 1) {
        newPos = targetPos;
        store.set(newPos);
      } else {
        newPos = dist(t);
        store.set(newPos);
        window.requestAnimationFrame(animate);
      }
    };
    window.requestAnimationFrame(animate);
  }

  return {
    set,
    subscribe: store.subscribe,
  };
}
