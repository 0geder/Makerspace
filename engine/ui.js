// UI: HTML overlay cards (info cards, dialogs, certificate) and toasts.
(function () {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let open = false;
  let current = null;
  let cardId = 0;

  MS.ui = {
    esc,
    isOpen: () => open,

    // card({ title, photo, blurb, facts:[], html, buttons:[{label, primary, disabled, onClick}], wide })
    card(o) {
      cardId++;
      const ov = document.getElementById("overlay");
      const facts = (o.facts || []).map((f) => "<li>" + esc(f) + "</li>").join("");
      ov.innerHTML =
        '<div class="card' + (o.wide ? " wide" : "") + '">' +
        (o.photo ? '<img class="card-photo" src="assets/photos/' + esc(o.photo) + '" alt="">' : "") +
        '<div class="card-body">' +
        (o.title ? "<h2>" + esc(o.title) + "</h2>" : "") +
        (o.blurb ? '<p class="blurb">' + esc(o.blurb) + "</p>" : "") +
        (facts ? "<ul>" + facts + "</ul>" : "") +
        (o.html || "") +
        '<div class="card-buttons"></div></div></div>';
      const bar = ov.querySelector(".card-buttons");
      (o.buttons || [{ label: "Close" }]).forEach((b) => {
        const el = document.createElement("button");
        el.textContent = b.label;
        if (b.primary) el.className = "primary";
        if (b.disabled) el.disabled = true;
        const myId = cardId;
        el.onclick = () => {
          MS.audio.unlock();
          MS.audio.play("click");
          if (b.onClick) b.onClick(ov);
          // close unless the handler already opened a different card
          if (!b.keepOpen && cardId === myId) MS.ui.closeCard();
        };
        bar.appendChild(el);
      });
      ov.classList.add("show");
      open = true;
      current = o;
      const first = ov.querySelector("input") || ov.querySelector("button.primary") || ov.querySelector("button");
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 30);
      return ov;
    },

    closeCard() {
      const ov = document.getElementById("overlay");
      if (!ov) return;
      ov.classList.remove("show");
      ov.innerHTML = "";
      open = false;
    },

    toast(msg) {
      const t = document.createElement("div");
      t.className = "toast";
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(() => t.classList.add("hide"), 2600);
      setTimeout(() => t.remove(), 3200);
    },
  };

  // Escape closes cards
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open && !(current && current.noEscape)) MS.ui.closeCard();
  });
})();
