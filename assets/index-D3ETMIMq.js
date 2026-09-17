(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={keys:[`C`,`C#`,`Db`,`D`,`D#`,`Eb`,`E`,`F`,`F#`,`Gb`,`G`,`G#`,`Ab`,`A`,`A#`,`Bb`,`B`],flatKeys:[`C`,`Db`,`D`,`Eb`,`E`,`F`,`Gb`,`G`,`Ab`,`A`,`Bb`,`B`],sharpKeys:[`C`,`C#`,`D`,`D#`,`E`,`F`,`F#`,`G`,`G#`,`A`,`A#`,`B`],noteNames:[`C`,`D`,`E`,`F`,`G`,`A`,`B`],keysWithFlats:[`C`,`F`,`Bb`,`Eb`,`Ab`,`Db`,`Gb`],symbolsLookup:[`[[:`,`[[`,`[[_`,`:]]`,`|`],notesDurationLookup:[`1`,`2`,`4`,`8`,`16`,`1.`,`2.`,`4.`,`8.`,`16.`,`1_`,`2_`,`4_`,`8_`,`16_`,`1._`,`2._`,`4._`,`8._`,`16._`,`8_3`,`4_3`],useFlats:!1,steps:0,transposeNote:function(t){let n=e.sharpKeys.indexOf(t);n===-1&&(n=e.flatKeys.indexOf(t));let r=n+e.steps;return r<0?r=e.sharpKeys.length+r:r>=e.sharpKeys.length&&(r-=e.sharpKeys.length),e.useFlats?e.flatKeys[r]:e.sharpKeys[r]},transposeChord:function(t){let n=t.substr(0,1);if(e.noteNames.indexOf(n)===-1)throw Error(`Error: Invalid note name --> `+n);let r=t.substr(1),i=t.substr(1,1);if(i===`#`?(n+=`#`,r=t.substr(2)):i===`b`&&(n+=`b`,r=t.substr(2)),n=e.transposeNote(n),t=n+r,t.indexOf(`/`)>-1){let n=t.substr(t.indexOf(`/`)+1);t=e.keys.indexOf(n)===-1?t.substr(0,t.indexOf(`/`))+`/`+n:t.substr(0,t.indexOf(`/`))+`/`+e.transposeNote(n)}return t},getItemType:function(t){let n=t.substr(0,1),r=t.substr(t.length-1,1),i=t.substr(0,3);if(n===`[`&&r===`]`)return{type:`section`,value:t.substr(1,t.length-2).replaceAll(`_`,` `)};if(e.symbolsLookup.indexOf(i)!==-1){if(i===`:]]`){let e=t.length>3?t.substr(3):null;return{type:`repeat`,value:i,times:parseInt(e)===2?null:e}}return{type:`symbol`,value:t}}if(n===`"`)return{type:`label`,value:t.substr(1).replaceAll(`_`,` `)};if(n===`'`)return{type:`comment`,value:t.substr(1).replaceAll(`_`,` `)};if(t.substr(0,2)===`[[`){let n=t.substr(2);e.useFlats=e.keysWithFlats.indexOf(n)>-1}else if(n===`(`){t=t.replaceAll(`(`,``).replaceAll(`)`,``);let n=t.split(`,`),r=[];return n.forEach(function(t){e.steps!==0||e.useFlats?r.push(e.transposeNote(t)):r.push(t)}),{type:`chord`,value:`(`+r.join(`,`)+`)`}}else{let n=t,r=null,i=`chord`;if(n.indexOf(`:`)!==-1){let a=t.split(`:`);n=a[0],r=a[1],r=r.split(`,`).map(function(t){if(e.notesDurationLookup.indexOf(t)===-1)throw Error(`Error: Invalid note duration --> `+t);return t}),n===`r`&&(i=`rest`)}return{type:i,value:(function(){return n===`x`||n===`r`?null:n===`%`?n:e.transposeChord(n)})(),timing:r}}return{type:null,value:null}},parse:function(t,n,r){if(e.steps=0,e.useFlats=!1,(n===void 0||n===``||!n)&&(n=`C`,e.useFlats=!0),e.keys.indexOf(n)===-1)throw Error(`Error: Invalid value for key --> `+n);let i=e.sharpKeys.indexOf(n);if(i===-1&&(i=e.flatKeys.indexOf(n)),r!==void 0&&r!==``&&r){if(e.keys.indexOf(r)===-1)throw Error(`Error: Invalid value for new key --> `+n);let t=e.sharpKeys.indexOf(r);t===-1&&(t=e.flatKeys.indexOf(r)),e.steps=t-i,e.useFlats=e.keysWithFlats.indexOf(r)>-1,(e.steps!==0||e.useFlats)&&(n=e.transposeNote(n))}let a=t.trim().split(` `),o=[];return a.forEach(function(t){if(t!==``){if((t.match(/\s*[\r\n]+\s*/g)||[]).length){let n=t.trim().split(/\s*[\r\n]+\s*/g);n.forEach(function(t,r){o.push(e.getItemType(t)),r<n.length-1&&o.push({type:`break`})})}else o.push(e.getItemType(t))}}),o}},t={dot:`<span class="dot">.</span>`,format:function(e){for(let n=0;n<e.length;n++)if(e[n].type===`symbol`||e[n].type===`repeat`){if(!t.symbolsLookup.hasOwnProperty(e[n].value))continue;e[n].value=t.symbolsLookup[e[n].value]}else if(e[n].type===`chord`){if(!e[n].timing)continue;let r=e[n].timing.join(`,`);if(t.beamsLookup.hasOwnProperty(r))e[n].timing=t.beamsLookup[r];else{let r=[];e[n].timing.forEach(function(e){t.notesDurationLookup.hasOwnProperty(e)&&r.push(t.notesDurationLookup[e])}),e[n].timing=r.join(``)}}else if(e[n].type===`rest`){if(!e[n].timing)continue;let r=[];e[n].timing.forEach(function(e){t.restsDurationLookup.hasOwnProperty(e)&&r.push(t.restsDurationLookup[e])}),e[n].timing=r.join(``)}return e}};t.symbolsLookup={"[[:":`{`,"[[":`"`,"[[_":`V`,":]]":`}`,"|":`\\`},t.notesDurationLookup={1:`w`,2:`h`,4:`q`,8:`e`,16:`s`,"1.":`R`,"2.":`d`,"4.":`j`,"8.":`i`,"16.":`s`+t.dot,"1_":`wU`,"2_":`hU`,"4_":`qU`,"8_":`eU`,"16_":`sU`,"1._":`RU`,"2._":`dU`,"4._":`jU`,"8._":`iU`,"16._":`s`+t.dot+`U`},t.restsDurationLookup={1:`W`,2:`H`,4:`Q`,8:`E`,16:`S`,"1.":`W`+t.dot,"2.":`D`,"4.":`J`,"8.":`I`,"16.":`S`+t.dot,"1_":`WU`,"2_":`HU`,"4_":`QU`,"8_":`EU`,"16_":`SU`,"1._":`W`+t.dot+`U`,"2._":`DU`,"4._":`JU`,"8._":`IU`,"16._":`S`+t.dot+`U`},t.beamsLookup={"16,16,8":`M`,"16,16":`N`,"16,8.":`O`,"8_3":`T`,"8,8,8,8":`Y`,"8,16,16":`m`,"8,8":`n`,"8.,16":`o`,"4_3":`t`,"16,16,16,16":`y`,"8,8,8":`§`,"16,16,16":`³`,"16,8,16":`¾`};var n={escapeHTML(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)},render(e){return`
        <div class="chord-plus">
            ${e.map(e=>e.type?e.type===`break`?`<div></div>`:`
                <div class="chord-plus__item ${e.type===`section`?`chord-plus__item--section`:``}">
                    ${e.type===`section`?`<div class="chord-plus__section">${this.escapeHTML(e.value)}</div>`:``}

                    <div class="chord-plus__item-container">
                        ${e.type===`chord`?`
                        <div class="chord-plus__item-content chord">
                            <div class="chord-value">${e.value?e.value:`&nbsp;`}</div>

                            ${e.timing?`
                            <div class="timing">${e.timing}</div>
                            `:``}
                        </div>
                        `:``}

                        ${e.type===`symbol`||e.type===`repeat`?`
                            <span class="chord-plus__item-content symbol">${this.escapeHTML(e.value)}</span>
                            `:``}

                        ${e.type===`comment`?`
                            <span class="chord-plus__item-content comment">${this.escapeHTML(e.value)}</span>
                            `:``}

                        ${e.type===`label`?`
                            <span class="chord-plus__item-content label">${this.escapeHTML(e.value)}</span>
                            `:``}

                        ${e.times?`
                            <span class="chord-plus__item-content repeat">x${this.escapeHTML(e.times)}</span>
                            `:``}

                        ${e.type===`rest`?`
                            <span class="chord-plus__item-content chord">
							    <div class="timing timing--rest">${e.timing}</div>
						    </span>
                            `:``}
                    </div>
                </div>`:``).join(``)}
        </div>
    `}},r={generateChordSheet:(r,i,a)=>{let o=e.parse(r,i,a),s=t.format(o);return n.render(s)},keys:e.keys};(()=>{let e=[{label:`Chords`,description:`Chords are displayed as is.`,input:`A B C D E F G
Am7 Bdim7 C#m9b13 DM9 E11 Fm6 G7b5`},{label:`Timing`,description:`You can indicate simple timings to complicated ones with dotted notes and ties.`,input:`C:1 C:2 C:4 C:8 C:16
C:1. C:2. C:4. C:8. C:16.
C:1_ C:2_ C:4_ C:8_ C:16_
C:1._ C:2._ C:4._ C:8._ C:16._
C:16,16,8 | C:16,16 | C:16,8. | C:8_3 | C:8,8,8,8 | C:8,16,16
C:8,8 | C:8.,16 | C:4_3 | C:16,16,16,16 | C:8,8,8 | C:16,16,16 | C:16,8,16`},{label:`Rests`,description:`The timing symbols can also be used to indicate rests.`,input:`r:1 r:2 r:4 r:8 r:16
r:1. r:2. r:4. r:8. r:16.
r:1_ r:2_ r:4_ r:8_ r:16_
r:1._ r:2._ r:4._ r:8._ r:16._`},{label:`Repetitions`,description:`Use repetition symbols to save space.`,input:`[[: C | F | G | C :]]
[[: C | F | G | C :]]4`},{label:`Comments`,description:`Add comments to make you chord sheet more informative.`,input:`'guitar [[: C | F | G | C :]]
'apostrophe' [[: C | F | G | C :]]
'double-quotes" [[: C | F | G | C :]]
'with_(parentheses) [[: C | F | G | C :]]
'synth_comes_in C | F | G | C
'whole_band_comes_in C | F | G | C`},{label:`Sections`,description:`Add sections of the song to better see its structure.`,input:`[Intro] [[: C | F | G | C :]]
[Chorus] 'whole_band F G | C | F G | C`},{label:`Labels`,description:`Labels are used in pair with repetition symbols. It can also be used to add jumps to different parts of the song.`,input:`[Intro] [[: "A. C | F | G | "1. C "2. Am C :]]
[[: C | F | G | C F | G C "To_A :]]`},{label:`Double Bar Line`,description:``,input:`[Intro] [[: C D [[ E:4,4,4 | G#m:4,4,4 :]]`},{label:`Bar Tie`,description:``,input:`[Intro] C:4,4,4,4 [[_ x:4 C:4,4,4`},{label:`Change Of Key`,description:`Though invisible, this will help ChordPlus in transposing the chords.`,input:`C D | Em F | Bb G C
[[ 'higher [[Eb Eb F | Gb G | A B`}],t=document.getElementById(`input`),n=document.getElementById(`output`),i=document.getElementById(`key`),a=document.getElementById(`transpose_to`),o=document.getElementById(`guides`),s=document.getElementById(`guides_description`);o.innerHTML=e.map((e,t)=>`<button class="guide_button" value="${t}" type="button">${e.label}</button>`).join(``);let c=document.querySelectorAll(`.guide_button`);[i,a].forEach(e=>{e.innerHTML=r.keys.map(e=>`<option value="${e}">${e}</option>`).join(``)});let l=e=>{try{n.innerHTML=r.generateChordSheet(e,i.value,a.value)}catch(e){console.info(e)}},u=1,d=null,f=e=>{u=1,d=setInterval(()=>{t.value=e.substring(0,u++),t.dispatchEvent(new Event(`keyup`)),u>e.length&&clearInterval(d)},20)};f(`[Intro] [[: C:4,4,4,4 Dm | Em F | G Am Bdim :]]3
[[ D:16,16,16 | r:1,2,4,8
[Verse] F G | Am G/B | C6/9`),t.addEventListener(`keyup`,()=>{l(t.value)}),[i,a].forEach(e=>{e.addEventListener(`change`,()=>{l(t.value)})}),o.querySelectorAll(`button`).forEach(n=>{n.addEventListener(`click`,r=>{e[r.target.value]&&(clearInterval(d),f(e[r.target.value].input),t.dispatchEvent(new Event(`keyup`)),c.forEach(e=>e.classList.remove(`active`)),n.classList.add(`active`),s.innerHTML=e[r.target.value].description)})})})();