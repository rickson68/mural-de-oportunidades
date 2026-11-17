function headerBody(header) {
  header.setAttribute("class", "border-b border-gray-200 bg-white");
  header.innerHTML = `
  <div
        class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6"
      >
        <a
          class="flex items-center gap-3 rounded-lg"
          href="#/"
          data-discover="true"
        >
          <span
            class="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"
          >
            <i data-lucide="book-open"></i>
          </span>
          <span>
            <span class="block text-sm font-bold text-gray-950 sm:text-base"
              >Mural de Oportunidades</span
            >
            <span class="hidden text-xs text-gray-400 sm:block"
              >Engenharia de Computação · UFC Sobral</span
            >
          </span>
        </a>
        <nav aria-label="Navegação principal" class="flex items-center gap-1">
          <a
            class="rounded-lg px-3 py-2 text-sm font-medium transition bg-blue-50 text-blue-700"
            href="#/"
            data-discover="true"
            aria-current="page"
            >Início</a
          >
          <a
            class="rounded-lg px-3 py-2 text-sm font-medium transition text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            href="#/quiz"
            data-discover="true"
            >Quiz</a
          >
          <a
            class="rounded-lg px-3 py-2 text-sm font-medium transition text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            href="#/calendario"
            data-discover="true"
            >Calendário</a
          >
        </nav>
      </div>
  `;
  lucide.createIcons();
}

function montar(root = document) {
  header = root.querySelector("header.cabecalho");
  headerBody(header);
}

document.addEventListener("DOMContentLoaded", () => montar());
