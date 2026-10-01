import { generateChordSheet, keys } from "../lib/main";

(() => {
  const demoInitialInput = `[Intro] [[: C:4,4,4,4 Dm | Em F | G Am Bdim :]]3
[[ D:16,16,16 | r:1,2,4,8
[Verse] F G | Am G/B | C6/9`;

  const inputField = document.getElementById("input"),
    outputField = document.getElementById("output"),
    keyField = document.getElementById("key"),
    transposeToField = document.getElementById("transpose_to");

  [keyField, transposeToField].forEach((input) => {
    input.innerHTML = keys
      .map((key) => `<option value="${key}">${key}</option>`)
      .join("");
  });

  const render = (input) => {
    try {
      outputField.innerHTML = generateChordSheet(
        input,
        keyField.value,
        transposeToField.value,
      );
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
})();
