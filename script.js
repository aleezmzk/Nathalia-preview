(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const topics = {
    cotidiano: {
      number: "01",
      title: "Comer também é viver.",
      description:
        "Como a rotina, a cultura e as possibilidades de cada pessoa se encontram na alimentação?",
      tags: ["Cultura alimentar", "Hábitos", "Vida real"],
      note: "Meu ponto de partida: observar o cotidiano e levar boas perguntas para a sala de aula.",
      color: "#d67452",
    },
    esporte: {
      number: "02",
      title: "Movimento que desperta perguntas.",
      description:
        "Como estudar a relação entre alimentação, prática esportiva, desempenho e recuperação?",
      tags: ["Prática esportiva", "Recuperação", "Formação"],
      note: "Um interesse que quero aprofundar durante a graduação, conectando as aulas às dúvidas sobre o movimento.",
      color: "#b5bd7e",
    },
    ciencia: {
      number: "03",
      title: "Entre uma dúvida e uma descoberta.",
      description:
        "De onde vem uma informação sobre alimentação? Como ler, comparar fontes e construir uma boa pergunta?",
      tags: ["Pesquisa", "Leitura crítica", "Aprendizado"],
      note: "Meu caderno começa com perguntas. As respostas pedem estudo, contexto e atenção às fontes.",
      color: "#d99ba5",
    },
  };
  const panel = document.querySelector("#topic-panel");
  const buttons = [...document.querySelectorAll(".topic")];
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const data = topics[button.dataset.topic];
      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-expanded", String(selected));
      });
      panel.querySelector(".panel-kicker").textContent =
        `Anotações de estudo / ${data.number}`;
      panel.querySelector("h3").textContent = data.title;
      panel.querySelector(".panel-description").textContent = data.description;
      panel.querySelector(".panel-note").textContent = data.note;
      const chips = panel.querySelector(".question-chips");
      chips.replaceChildren(
        ...data.tags.map((text) => {
          const span = document.createElement("span");
          span.textContent = text;
          return span;
        }),
      );
      panel
        .querySelector(".fruit-art svg path:nth-of-type(3)")
        .setAttribute("fill", data.color);
      panel.classList.remove("panel-changing");
      if (!reduce.matches) {
        void panel.offsetWidth;
        panel.classList.add("panel-changing");
      }
    }),
  );
  let observer;
  function configureMotion() {
    observer?.disconnect();
    document.documentElement.classList.toggle(
      "js-motion",
      !reduce.matches && "IntersectionObserver" in window,
    );
    if (reduce.matches || !("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
  }
  configureMotion();
  reduce.addEventListener("change", () => {
    configureMotion();
    schedule();
  });
  const progress = document.querySelector(".progress");
  const art = document.querySelector(".hero-art");
  const hero = document.querySelector(".hero");
  let queued = false;
  function render() {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    const rect = hero.getBoundingClientRect();
    const offset =
      !reduce.matches && window.innerWidth > 700
        ? Math.min(50, Math.max(0, -rect.top * 0.08))
        : 0;
    art.style.setProperty("--portrait-y", `${offset}px`);
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("load", schedule, { once: true });
  render();
  if ("IntersectionObserver" in window) {
    const ticker = document.querySelector(".ticker-track");
    const pause = new IntersectionObserver((entries) =>
      entries.forEach((entry) => {
        ticker.style.animationPlayState = entry.isIntersecting
          ? "running"
          : "paused";
      }),
    );
    pause.observe(ticker);
  }
})();
