---
# try also 'default' to start simple
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: true
# some information about the slides, markdown enabled
info: |
  ## How to draw an owl
  Presentation about transitions and tweening is js

# persist drawings in exports and build
drawings:
  persist: false
---

# How to draw an owl

---
layout: center
---

![Owl](/owl.jpg)

---
layout: image-right
image: https://www.triplejack.com/profiles/1146618-d1d0b060e4aacdb4b0fcf4cd4cd30105.jpg
---

# Animation naïve 
## Translation 2D avec setInterval()


<div v-click class="text-4xl text-center">

$$ d = v \cdot t $$


  <div class="text-lg italic text-center">
  avec vitesse fixe, durée fixe
  </div>
</div>




---
layout: iframe-left
url: http://localhost:5000/#naive
---

```ts
let x = 10;
$: cleanX = Math.round(x);

const smoothMove = 
        (step: number, duration = 1) => {
  const start = window.performance.now();
  const loopID = setInterval(() => {
        const now = window.performance.now();
        if (now > start + duration * 1000) {
            clearInterval(loopID);
        }
        x += step;
    }, 1000 / 60  // 60 fps
  );
}
```

```html
<div class="container">
  <button on:click={() => smoothMove(.25)}>
    Click me
  </button>
  <div class="circle" style="left:{x}%">
      <span class="text">{cleanX}%</span>
  </div>
</div>
```


---
layout: image-right
image: https://www.allaboutbirds.org/guide/assets/photo/297342421-480px.jpg
---

# Tweening _(ou interpolation)_


<div class="text-4xl text-center">

$$ A \to B $$


  <div class="text-lg italic text-center">
  distance fixe, durée fixe <br/>
  vitesse variable
  </div>
</div>


---
layout: image-right
image: https://www.seekpng.com/png/detail/949-9494500_administration-owl-teacher-cartoon.png
---

# Tweening avec setInterval()

- Arguments : position d'origine x<sub>A</sub>, position cible x<sub>B</sub>, durée D
- Normalisation du temps (t ∈ [0, 1])

$$
\begin{aligned}
t & = t_{écoulé} / D \\
tween(t) & = x_A + t \cdot (x_B - x_A) \\
tween(0) & = x_A \\
tween(1) & = x_B \\
\end{aligned}
$$


---
layout: iframe-left
url: http://localhost:5000/#naive-tween
---

```ts
export let x = 10;

const tween = 
    (targetPos: number, duration: number) => {
  const startPos = x;
  const start = window.performance.now();
  const dist = (t) => 
    startPos + t * (targetPos - startPos);

  const loopID = setInterval(() => {
    const elapsed = 
        window.performance.now() - start;
    if (elapsed > duration) {
      clearInterval(loopID);
    } else {
      x = dist(elapsed / duration);
    }
  }, 1000 / 60  // 60 fps
  );
}
$: tween(target, duration);
```

```html
<div class="circle" 
     style="transform: translateX({x/100 * width}px);">
  <span class="text">{cleanX}%</span>
</div>
```

---
layout: image-right
image: https://cdn2.vectorstock.com/i/1000x1000/72/41/cute-owl-in-a-pilot-hat-vector-20437241.jpg
---

# RAF
```js
 window.requestAnimationFrame(callback);
```

- ☎️ Le browser appelera `callback` le prochain repaint
- ℹ️ `callback(ts)` avec ts, timestamp en ms
- ⏱ Permet de synchroniser et d'optimiser toutes les animations
- ✋ Mis en pause si l'onglet n'est pas visible


---
layout: image-left
image: https://images.kernelshirt.com/2021/07/Thats-what-I-do-I-fly-and-I-know-things-Owl-Pilot-poster.jpg
---

# Utilisation

```ts
const start = window.performance.now();

const animate = (ts: number) => {
  const t = (ts - start) / duration;
  if (t >= 1) {
    // Condition de sortie
  } else {
    // Animation avec t et appel récursif
    window.requestAnimationFrame(animate);
  }
};
window.requestAnimationFrame(animate);
```

---
layout: two-cols
---

<template v-slot:default>

## Code précédent 

```ts{monaco}
export let x = 10;

const tween = 
    (targetPos: number, duration: number) => {
  const startPos = x;
  const start = window.performance.now();
  const dist = (t) => 
    startPos + t * (targetPos - startPos);

  const loopID = setInterval(() => {
    const elapsed = 
        window.performance.now() - start;
    if (elapsed > duration) {
      clearInterval(loopID);
    } else {
      x = dist(elapsed / duration);
    }
  }, 1000 / 60  // 60 fps
  );
}
$: tween(target, duration);
```
</template>

<template v-slot:right>

## RAF

```ts{monaco}
const start = window.performance.now();

const animate = (ts: number) => {
  const t = (ts - start) / duration;
  if (t >= 1) {
    // Condition de sortie
  } else {
    // Animation avec t et appel récursif
    window.requestAnimationFrame(animate);
  }
};
window.requestAnimationFrame(animate);
```
</template>

---
layout: iframe-left
url: http://localhost:5000/#raf-tween
---

```ts
const tween = 
  (targetPos: number, duration: number) => {
  
  const startPos = x;
  const start = window.performance.now();
  const dist = (t) => 
          startPos + t * (targetPos - startPos);

  const animate = (ts: number) => {
    const t = (ts - start) / duration;
    if (t >= 1) {
      x = targetPos;
    } else {
      x = dist(t);
      window.requestAnimationFrame(animate);
    }
  };
  window.requestAnimationFrame(animate);
};
$:tween(target, duration);
```

---
layout: center
---
# Utilitaire avec un store Svelte
Store Svelte

```js
// Init
const store = writable(0);
// MAJ
store.set(100);
store.update( n => n + 1)
// Abonnement et désabonnement
const unsubscribe = store.subscribe( value => console.log(value) );
unsubscribe();

// Auto-abonnement/désabonnement
$store
```

Un peu comme `useContext()` en React ou `BehaviorSubject` en Angular/RxJs

---
layout: iframe-left
url: http://localhost:5000/#svelte-tween
class: code-sm
---

```ts
export function tween(init: number) {
  const store = writable(init);
  let newPos = init;
  function set(targetPos: number, 
               duration: number): void {
    const startPos = newPos;
    const start = window.performance.now();
    const dist = (t) => 
            startPos + t * (targetPos - startPos);

    const animate = (ts: number) => {
      const t = (ts - start) / duration;
      if (t >= 1) {
        newPos = targetPos;
        store.set(newPos);
      } else {
        newPos = dist(t);
        store.set(newPos);
        window.requestAnimationFrame(animate);
      }};
    window.requestAnimationFrame(animate);
  }
  return { set, subscribe: store.subscribe,};
}
```

```ts
const x = tween(init);
$: x.set(target, duration);
```

```html
 <div class="circle" 
      style="transform: translateX({$x/100 * width}px);">
    <span class="text">{Math.round($x)}%</span>
  </div>
```


---
layout: iframe-right
url: https://svelte.dev/docs#run-time-svelte-motion-tweened
---

# Tweened, by Svelte
[https://svelte.dev/docs#run-time-svelte-motion-tweened](https://svelte.dev/docs#run-time-svelte-motion-tweened)

<iframe id="other" class="w-full h-full" style="zoom: 0.75;" src="http://localhost:5000/#other"></iframe>


---
layout: image-left
image: https://i2-prod.mirror.co.uk/incoming/article5969275.ece/ALTERNATES/s1200c/PAY-The-owls-spot-something-in-the-corner-that-gets-their-attention.jpg
---

# Application du tweening sur d'autres propriétés

---
layout: iframe-right
url: http://localhost:5000/#svg
---

```ts
let path: SVGPathElement;
let length = 0;
onMount(() => length = path.getTotalLength());

let pathPercent = tweened(0, { 
    duration: 3000, 
    easing: cubicInOut
  }
);
const drawing = derived(pathPercent, $p => 
  `stroke-dasharray: 
  ${$p * length} ${(1 - $p) * length}`);
```

```html
<svg>
  <g>
    <path bind:this={path}
          style={$drawing}
          d={shape} ></path>
  </g>
</svg>
```

---
layout: image-left
image: https://preview.redd.it/5hnjqynshkg71.jpg?auto=webp&s=08a3633d58a1377fa69d7d6d2d75241747b78443
---

# Est-ce qu'on va plus loin ?

---
layout: center
---
![Equations Horaires](http://res-nlp.univ-lemans.fr/NLP_C_M01_G01/res/Fig_18_1.gif)

### Equations horaires
$$
\left\{
  \begin{array}{ll}
    x & = v_0 \cdot cos(\alpha) \cdot t \\
    z & = -g \cdot \dfrac{t^2}{2} + v_0 \cdot sin(\alpha) \cdot t
  \end{array}
\right.
$$

nothing

---
layout: iframe-left
url: http://localhost:5000/#bullet
class: code-sm
---

```ts
const ballX = tweened(0, {
  interpolate: (a, b) => 
    t => a + (b-a) * v0*Math.cos(alpha)*t,
  duration,
});

const ballY = tweened(0, {
  interpolate: () =>
    t => (g/2*t**2 - v0*Math.sin(alpha)*t) * 100,
  duration,
});

const speed = tweened(0, {
  interpolate: () =>
    t => Math.abs(g*t - v0*Math.sin(alpha))* 100,
  duration,
});
```

```html
<div class="ball"
   style="transform:translate({$ballX}vw, {$ballY}vh);
          --color:{interpolatePlasma($speed/150)}">
</div>
```

---
layout: iframe
url: http://localhost:5000/#karaoke
---