import { Readable, writable } from "svelte/store";

export interface Tweened extends Readable<number> {
  set(value: number): void;
}

export function tween(init: number, duration: number): Tweened {
  const store = writable(init);
  let newPos = init;

  function set(targetPos: number): void {
    const startPos = newPos;
    const start = window.performance.now();
    const dist = (t) => startPos + t * (targetPos - startPos);

    const animate = () => {
      const elapsed = window.performance.now() - start;
      if (elapsed > duration) {
        newPos = targetPos;
        store.set(newPos);
      } else {
        newPos = dist(elapsed / duration);
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
