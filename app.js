async function getDashBoardData(url = "/data.json") {
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

class DashBoardItem {
  static PERIODS = {
    daily: "day",
    weekly: "week",
    monthly: "month",
  };

  constructor(data, container = ".dashboard__content", view = "weekly") {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    this._createMarkUp();
  }

  _createMarkUp() {
    const { title, timeframes } = this.data;
    const id = title.toLowerCase().replace(/\s/g, "-");
    const { current, previous } = timeframes[this.view.toLowerCase()];

    this.container.insertAdjacentHTML(
      "beforeend",
      `<div class="dashboard__item dashboard__item_${id}">
          <article class="tracking-card">
            <header class="tracking-card__header">
              <h4 class="tracking-card__title">${title}</h4>
              <img
                class="tracking-card__menu"
                src="images/icon-ellipsis.svg"
                alt="Menu"
              />
            </header>
            <div class="tracking-card__boby">
              <div class="tracking-card__time">${current}hrs</div>
              <div class="tracking-card__prev-period">Last ${
                DashBoardItem.PERIODS[this.view]
              } - ${previous}hrs</div>
            </div>
          </article>
        </div>`
    );

    this.time = this.container.querySelector(
      `.dashboard__item_${id} .tracking-card__time`
    );

    this.prev = this.container.querySelector(
      `.dashboard__item_${id} .tracking-card__prev-period`
    );
  }

  changeView(view) {
    this.view = view.toLowerCase();
    const { current, previous } = this.data.timeframes[this.view.toLowerCase()];

    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${
      DashBoardItem.PERIODS[this.view]
    } - ${previous}hrs`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getDashBoardData().then((data) => {
    const activities = data.map((activity) => new DashBoardItem(activity));
    const selectors = document.querySelectorAll(".view-selector__item");

    selectors.forEach((selector) =>
      selector.addEventListener("click", () => {
        selectors.forEach((sel) => {
          if (sel.classList.contains("view-selector__item_active")) {
            sel.classList.remove("view-selector__item_active");
          }
        });
        selector.classList.add("view-selector__item_active");
        const currentView = selector.innerText.trim().toLowerCase();
        activities.forEach((activity) => activity.changeView(currentView));
      })
    );
  });
});
