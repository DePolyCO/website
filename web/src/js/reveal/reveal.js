import { select, bindAll, Observer, ro, Timeline, qs } from "../hermes";

// const canvasEl = document.createElement("canvas");
// const ghost =
//   "OffscreenCanvas" in window
//     ? canvasEl.transferControlToOffscreen()
//     : canvasEl;
// const context = ghost.getContext("2d");

/**
 *
 * insert: [
 *    {
 *      index: 0,
 *      token: '<span class="highlight">
 *    },
 *    {
 *      index: 10,
 *      token: '</span>
 *    },
 * ]
 *
 */

const hiddenDiv = qs("#text-reveal");
const hiddenStyle = hiddenDiv.style;

export class Reveal {
  constructor({
    targets,
    stagger = 0,
    delay = 0,
    auto = false,
    threshold = 0.5,
    easing = "o6",
    duration = 1750,
    indent = 0, // in viewportWidth units
    indentFrom = 0,
    indentTo = 1,
    from = 102,
    to = 0,
    char = false,
    skipGuarantee = false, // guarantee that the text will always be one line
    rotate = false,
    insert = [],
  }) {
    Object.assign(this, {
      targets: select(targets),
      stagger,
      delay,
      auto,
      threshold,
      easing,
      duration,
      indent,
      indentFrom,
      indentTo,
      from,
      to,
      char,
      skipGuarantee,
      rotate,
    });

    // cache texts because it will be overwritten
    this.cache = new Map();
    this.targets.forEach((target, i) => {
      // if (target.innerHTML.indexOf("<") > 0) {
      //   console.log(
      //     target.innerHTML,
      //     target.innerHTML.indexOf("<"),
      //     target.innerHTML.indexOf("</")
      //   );
      //   console.log(
      //     target.innerHTML.slice(
      //       target.innerHTML.indexOf("<") + 1,
      //       target.innerHTML.indexOf("</")
      //     )
      //   );
      // }
      this.cache.set(i, target.textContent.replace(/\s\s+/g, " ").trim());
    });
    this.triggered = false;

    // attach resize listener
    bindAll(this, ["resize", "play", "destroy"]);

    this.bounds = { vw: window.innerWidth, vh: window.innerHeight };
    ro.add({
      update: this.resize,
    });

    // init stuff
    this.auto && this.observe();
    this.tween = new Timeline();
    insert.length && (this.insert = insert);

    this.resize();
  }

  // TODO:
  // Use a more efficient algorithm
  // Too many DOM reflows here
  resize(bounds = { vw: window.innerWidth, vh: window.innerHeight }) {
    this.bounds = bounds;
    this.destroy();

    // convert from vw to pixels
    if (this.indent) {
      this.compIndent = this.indent * bounds.vw * 0.01;
      // this.compIndent = this.indent;
    }

    // this.targets.forEach((target) => {
    // new path

    // const maxwidth = target.getBoundingClientRect().width;
    // const words = target.textContent.split(" ");

    // const lines = [];
    // let curline = [];

    // const comp = window.getComputedStyle(target);
    // const ff = comp.getPropertyValue("font-family");
    // const fs = comp.getPropertyValue("font-size");
    // const fw = comp.getPropertyValue("font-weight");
    // context.font = `${fw} ${fs} ${ff}`;

    // for (let i = 0; i < words.length; i++) {
    //   curline.push(words[i]);
    //   if (context.measureText(curline.join(" ")).width >= maxwidth) {
    //     const cache = curline.pop();
    //     lines.push(curline.join(" "));
    //     curline = [cache];
    //   }
    // }
    // lines.push(curline.join(" "));
    // });

    // old path

    const tn = this.targets.length;

    for (let i = 0; i < tn; i++) {
      const target = this.targets[i];
      let lines = [];

      if (this.skipGuarantee || target.dataset.skipGuarantee) {
        // avoid calc when skipGuarantee is provided
        lines.push(this.cache.get(i));
      } else {
        // set styles
        const maxwidth = target.offsetWidth;
        const comp = window.getComputedStyle(target);
        const s = hiddenStyle;
        s.fontFamily = comp.getPropertyValue("font-family");
        s.fontSize = comp.getPropertyValue("font-size");
        s.fontWeight = comp.getPropertyValue("font-weight");
        s.letterSpacing = comp.getPropertyValue("letter-spacing");
        s.textTransform = comp.getPropertyValue("text-transform");

        // calculate lines
        let curline = [];
        const words = this.cache.get(i).split(" ");
        const n = words.length;
        for (let i = 0; i < n; i++) {
          const word = words[i];
          if (word === " ") continue;

          curline.push(word);
          hiddenDiv.textContent = curline.join(" ");
          let nwidth = maxwidth;

          if (
            this.compIndent > 0 &&
            lines.length >= this.indentFrom &&
            lines.length < this.indentTo
          ) {
            nwidth = maxwidth - this.compIndent;
          }
          if (hiddenDiv.offsetWidth >= nwidth) {
            curline.pop();
            lines.push(curline.join(" "));
            curline = [word];
          }
          if (word === "XBRX") {
            curline.pop();
            lines.push(curline.join(" "));
            curline = [];
          }
        }

        lines.push(curline.join(" "));
      }

      // insert lines
      const paraFrag = document.createDocumentFragment();

      const ln = lines.length;

      let insertIndex = 0;
      let totalLength = 0;
      let prevLength = 0;
      let prevTokenLength = 0;

      for (let j = 0; j < ln; j++) {
        let line = lines[j];
        if (line.length === 0) continue; // skip empty lines

        // TODO:
        // Copy properties from original line:
        // For eg: data-* or href
        // Also, preserve non-span elements, especially anchor tags
        const wrapperEl = document.createElement("span");

        if (this.char) {
          wrapperEl.classList.add("l-char--wrapper");
          const n = line.length;
          for (let i = 0; i < n; i++) {
            const char = line[i];
            const charEl = document.createElement("span");
            charEl.classList.add("l-char");
            this.visible && (charEl.style.transform = `none`);
            if (char === " ") {
              charEl.classList.add("l-space");
            }
            charEl.innerText = char;
            wrapperEl.appendChild(charEl);
          }
        } else {
          wrapperEl.classList.add("l-wrapper");
          const lineEl = document.createElement("span");
          lineEl.classList.add("l-line");
          this.visible && (lineEl.style.transform = `none`);

          // runs once for each line
          if (this.insert && insertIndex < this.insert.length) {
            totalLength += line.length;
            prevTokenLength = 0;
            let writeFlag = false;

            // run once for each item
            for (let j = insertIndex; j < this.insert.length; j++) {
              const item = this.insert[j];

              const index = item.index - prevLength + prevTokenLength;
              const token = item.token;

              if (item.index < totalLength) {
                line = line.substring(0, index) + token + line.substring(index);
                lineEl.innerHTML = line;

                prevTokenLength += token.length;
                insertIndex = j + 1;
                writeFlag = true;
              } else {
                if (writeFlag) {
                  lineEl.innerHTML = line;
                } else {
                  lineEl.innerText = line + " ";
                }
                break;
              }
            }

            prevLength = totalLength;
          } else {
            lineEl.innerText = line + " ";
          }

          wrapperEl.appendChild(lineEl);
        }

        paraFrag.appendChild(wrapperEl);
      }

      // erase content
      target.innerHTML = null;
      // Insert new content
      target.appendChild(paraFrag);

      hiddenDiv.textContent = "";
    }
    // });

    this.targetLines = this.getTargets(this.targets);

    if (this.indent) {
      const limit = Math.min(this.indentTo, this.targetLines.length);
      for (let j = 0; j < tn; j++) {
        const target = this.targets[j];
        for (let i = this.indentFrom; i < limit; i++) {
          target.children[0].children[
            i
          ].style.textIndent = `${this.compIndent}px`;
        }
      }
    }

    if (this.auto && !this.visible) {
      this.observeTargets();
    }

    this.isResizing = false;
  }

  getTargets(node) {
    let arr = [];
    node = select(node);
    node.forEach((target) => {
      [...target.children].forEach((el) => {
        if (!this.char) {
          arr.push(el.children[0]);
        } else {
          arr = [...arr, ...el.children];
        }
      });
    });
    return arr;
  }

  play({
    targets = this.targetLines,
    delay = this.delay,
    to = this.to,
    from = this.from,
    duration = this.duration,
    easing = this.easing,
    stagger = this.stagger,
    reverse = false,
    reverseDelay = 0,
    visible = true,
    autoplay = true,
  } = {}) {
    if (reverse && this.tween) {
      this.tween.do("reverse", {
        targets,
        delay: reverseDelay ? reverseDelay : 0,
      });
    } else {
      // this.tween.do("destroy");
      this.tween = new Timeline({
        duration,
        easing,
      });
      const n = targets.length;
      this.visible = visible;
      for (let i = 0; i < n; i++) {
        const target = targets[i];
        this.tween.add({
          targets: target,
          delay: delay + i * stagger,
          autoplay: autoplay,
          transform: {
            y: [from, to],
            yu: "%",
            r: this.rotate
              ? [
                  [1, 0, 0, -90],
                  [1, 0, 0, 0],
                ]
              : false,
          },
        });
      }
    }
  }

  playTo({
    delay = this.delay,
    to = this.to,
    duration = this.duration,
    easing = this.easing,
    stagger = this.stagger,
    visible = true,
  } = {}) {
    this.visible = visible;
    if (!this.tween.train.length) {
      // early stopping
      return this.play({
        delay: this.delay,
        to: this.to,
        duration: this.duration,
        easing: this.easing,
        stagger: this.stagger,
        visible,
      });
    }
    const oldTL = this.tween.train.map((el) => el.anim.cur);
    const n = oldTL.length;

    this.tween.do("destroy");
    this.tween = new Timeline({
      targets: this.targetLines,
      duration,
      easing,
    });

    for (let i = 0; i < n; i++) {
      const target = this.targetLines[i];
      const tl = oldTL[i];
      // if (!oldTL[i].delay.completed) return;
      this.tween.add({
        targets: target,
        delay: delay + i * stagger,
        transform: {
          y: [tl[0], to],
          yu: "%",
          r: this.rotate
            ? [
                [tl[1], tl[2], tl[3], tl[4]],
                [1, 0, 0, to === 0 ? 0 : 90],
              ]
            : false,
        },
      });
    }

    return this.tween;
  }

  /**
   *
   * To auto-start
   * animation on visibility
   *
   */

  observe() {
    //   create observer
    this.observer?.disconnect();
    this.observer = Observer().create({
      callback: (node, isIntersecting, unobserve) => {
        if (isIntersecting) {
          this.play({ targets: this.getTargets(node), from: this.from });
          unobserve(node);
          this.triggered = true;
        }
      },
      threshold: this.threshold,
    });
  }

  observeTargets() {
    // set observer to observe targets
    this.observer.observe(this.targets);
  }

  destroy() {
    // cleanup listeners and restore text to the initial state
    this.observer && this.observer.disconnect();
    this.tween?.do("destroy");
    // this.targets.forEach((target, i) => {
    //   target.textContent = this.cache.get(i);
    // });
  }
}
