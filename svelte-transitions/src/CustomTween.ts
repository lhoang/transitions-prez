import { Readable, writable } from "svelte/store";

export interface Tweened extends Readable<number> {
  set(value: number): void;
}

export function tween(init: number): Tweened {
  const speed = 1;
  const store = writable(init);
  let newPos = init;

  function set(targetPos: number): void {
    const sign = Math.sign(targetPos - newPos);
    const animate = () => {
      if (
        (sign >= 0 && newPos >= targetPos) ||
        (sign < 0 && newPos <= targetPos)
      ) {
        newPos = targetPos;
        store.set(newPos);
      } else {
        newPos += sign * speed;
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
