# GK Gks — Birthday Website

A responsive birthday microsite inspired by the supplied Netlify reference. It includes a live countdown, age calculator, approximate moon-phase display, interactive candles, memories gallery, and birthday wishes.

## 1. Personalize it
Open `script.js` and edit the `CONFIG` object at the top:

```js
const CONFIG = {
  name: "Her",
  birthday: "2006-02-02", // YYYY-MM-DD
  signature: "GK Gks",
  musicFile: "assets/birthday-song.mp3"
};
```

Change the name, date, and signature. Put an MP3 named `birthday-song.mp3` in the `assets` folder, or set `musicFile` to an empty string.

## 2. Run it
Open `index.html` in a browser. For best results, use a local static server (for example VS Code Live Server).

## 3. Publish on Netlify
1. Extract the ZIP.
2. Open Netlify and choose **Add new site → Deploy manually**.
3. Drag the extracted project folder (the folder containing `index.html`) into the deploy area.
4. Netlify will publish it and provide a shareable URL.

## Important storage note
The memories gallery uses IndexedDB in the visitor's browser; wishes use localStorage. This means each visitor's content is stored on their own device/browser and is **not automatically visible to other visitors**. A shared public gallery/wall where everyone sees everyone else's uploads needs a backend such as Supabase or Firebase, including storage rules and moderation. Do not collect public uploads without appropriate safeguards.

## Included files
- `index.html` — page content and sections
- `style.css` — responsive styling and glassmorphism
- `script.js` — countdown, age, lunar estimate, candles, memories and wishes
- `assets/` — add your music and other static assets here

The lunar values are decorative approximations, not an astronomical ephemeris.
