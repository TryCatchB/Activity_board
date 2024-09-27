const PERIODS = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

document.addEventListener("DOMContentLoaded", () => {
  getDashBoardData().then((data) => {
    const activities = data.map((activity) => new DashBoardItem(activity));
    const viewSelectorContainer = document.querySelector(".view-selector");

    addActiveClass(
      viewSelectorContainer,
      activities,
      "view-selector__item_active"
    );
  });
});

async function getDashBoardData(url = "/data.json") {
  const response = await fetch(url);
  return await response.json(); // Return directly, no need to store in a variable
}

function addActiveClass(container, activities, activeClass) {
  let activeSelector = container.querySelector(`.${activeClass}`);

  container.addEventListener("click", (event) => {
    const viewSelector = event.target.closest(".view-selector__item");
    if (!viewSelector || viewSelector === activeSelector) return;

    const currentView = viewSelector.innerText.toLowerCase();

    if (activeSelector) {
      activeSelector.classList.remove(activeClass);
    }

    viewSelector.classList.add(activeClass);
    activeSelector = viewSelector;

    activities.forEach((activity) => activity.changeView(currentView));
  });
}

class DashBoardItem {
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
            <div class="tracking-card__body">
              <div class="tracking-card__time">${current}hrs</div>
              <div class="tracking-card__prev-period">Last ${
                PERIODS[this.view]
              } - ${previous}hrs</div>
            </div>
          </article>
        </div>`
    );

    const dashboardItem = this.container.querySelector(
      `.dashboard__item_${id}`
    );
    this.time = dashboardItem.querySelector(".tracking-card__time");
    this.prev = dashboardItem.querySelector(".tracking-card__prev-period");
  }

  changeView(view) {
    this.view = view.toLowerCase();
    const { current, previous } = this.data.timeframes[this.view];

    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${PERIODS[this.view]} - ${previous}hrs`;
  }
}
