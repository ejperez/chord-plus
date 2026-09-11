import { Parser, Formatter, Renderer } from "../lib/main";

const parsedSong = Parser.parse(`
[Intro] [[: C:4,4,4,4 Dm | Em F | G Am Bdim :]]3
[[ D:16,16,16 | r:1,2,4,8
[Verse] [[F F G | Am G/B | C6/9`);
const formattedSong = Formatter.format(parsedSong);
// console.log(formattedSong);
const renderedHtml = Renderer.render(formattedSong);
console.log(renderedHtml);

document.getElementById("output").innerHTML = renderedHtml;
