import { Parser, Formatter, Renderer } from "../lib/main";

(() => {
  const demoInitialInput = `[Intro] [[: C:4,4,4,4 Dm | Em F | G Am Bdim :]]3
[[ D:16,16,16 | r:1,2,4,8
[Verse] F G | Am G/B | C6/9`;

  const guides = [
    {
      label: "Chords",
      description: "Chords are displayed as is.",
      input: `A B C D E F G
Am7 Bdim7 C#m9b13 DM9 E11 Fm6 G7b5`,
    },
    {
      label: "Timing",
      description:
        "You can indicate simple timings to complicated ones with dotted notes and ties.",
      input: `C:1 C:2 C:4 C:8 C:16
C:1. C:2. C:4. C:8. C:16.
C:1_ C:2_ C:4_ C:8_ C:16_
C:1._ C:2._ C:4._ C:8._ C:16._
C:16,16,8 | C:16,16 | C:16,8. | C:8_3 | C:8,8,8,8 | C:8,16,16
C:8,8 | C:8.,16 | C:4_3 | C:16,16,16,16 | C:8,8,8 | C:16,16,16 | C:16,8,16`,
    },
    {
      label: "Rests",
      description: "The timing symbols can also be used to indicate rests.",
      input: `r:1 r:2 r:4 r:8 r:16
r:1. r:2. r:4. r:8. r:16.
r:1_ r:2_ r:4_ r:8_ r:16_
r:1._ r:2._ r:4._ r:8._ r:16._`,
    },
    {
      label: "Repetitions",
      description: "Use repetition symbols to save space.",
      input: `[[: C | F | G | C :]]
[[: C | F | G | C :]]4`,
    },
    {
      label: "Comments",
      description: "Add comments to make you chord sheet more informative.",
      input: `'guitar [[: C | F | G | C :]]
'apostrophe' [[: C | F | G | C :]]
'double-quotes" [[: C | F | G | C :]]
'with_(parentheses) [[: C | F | G | C :]]
'synth_comes_in C | F | G | C
'whole_band_comes_in C | F | G | C`,
    },
    {
      label: "Sections",
      description: "Add sections of the song to better see its structure.",
      input: `[Intro] [[: C | F | G | C :]]
[Chorus] 'whole_band F G | C | F G | C`,
    },
    {
      label: "Labels",
      description:
        "Labels are used in pair with repetition symbols. It can also be used to add jumps to different parts of the song.",
      input: `[Intro] [[: "A. C | F | G | "1. C "2. Am C :]]
[[: C | F | G | C F | G C "To_A :]]`,
    },
    {
      label: "Double Bar Line",
      description: "",
      input: `[Intro] [[: C D [[ E:4,4,4 | G#m:4,4,4 :]]`,
    },
    {
      label: "Bar Tie",
      description: "",
      input: `[Intro] C:4,4,4,4 [[_ x:4 C:4,4,4`,
    },
    {
      label: "Change Of Key",
      description:
        "Though invisible, this will help ChordPlus in transposing the chords.",
      input: `C D | Em F | Bb G C
[[ 'higher [[Eb Eb F | Gb G | A B`,
    },
  ];

  const inputField = document.getElementById("input"),
    outputField = document.getElementById("output"),
    keyField = document.getElementById("key"),
    transposeToField = document.getElementById("transpose_to"),
    guidesContainer = document.getElementById("guides"),
    guidesDescription = document.getElementById("guides_description");

  guidesContainer.innerHTML = guides
    .map(
      (guide, index) =>
        `<button class="guide_button" value="${index}" type="button">${guide.label}</button>`,
    )
    .join("");

  const guideButtons = document.querySelectorAll(".guide_button");

  [keyField, transposeToField].forEach((input) => {
    input.innerHTML = Parser.keys
      .map((key) => `<option value="${key}">${key}</option>`)
      .join("");
  });

  const render = (input) => {
    try {
      const parsedSong = Parser.parse(
        input,
        keyField.value,
        transposeToField.value,
      );
      const formattedSong = Formatter.format(parsedSong);
      const renderedHtml = Renderer.render(formattedSong);

      outputField.innerHTML = renderedHtml;
    } catch (e) {
      console.info(e);
    }
  };

  // Animate initial demo input
  let counter = 1;
  let interval = null;

  const animateInput = (input) => {
    counter = 1;
    interval = setInterval(() => {
      inputField.value = input.substring(0, counter++);
      inputField.dispatchEvent(new Event("keyup"));

      if (counter > input.length) {
        clearInterval(interval);
      }
    }, 20);
  };

  animateInput(demoInitialInput);

  // Handle input events
  inputField.addEventListener("keyup", () => {
    render(inputField.value);
  });

  [keyField, transposeToField].forEach((input) => {
    input.addEventListener("change", () => {
      render(inputField.value);
    });
  });

  guidesContainer.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (!guides[event.target.value]) return;

      clearInterval(interval);
      animateInput(guides[event.target.value].input);
      inputField.dispatchEvent(new Event("keyup"));

      guideButtons.forEach((button) => button.classList.remove("active"));
      button.classList.add("active");

      guidesDescription.innerHTML = guides[event.target.value].description;
    });
  });
})();
