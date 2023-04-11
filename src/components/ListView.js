import Component from "../core/Component.js";
import LeftButton from "./LeftButton.js";
import RightButton from "./RightButton.js";
import NewsContent from "./NewsContent.js";
import Tab from "./Tab.js";

const LEFT = -1;
const RIGHT = 1;

export default class ListView extends Component {
  setup() {
    const { presses } = this.props;
    const sortedPresses = [...presses];
    sortedPresses.sort((a, b) => (a.category_id < b.category_id ? -1 : 1));

    const categoriesId = [
      ...new Set(sortedPresses.map((press) => press.category_id)),
    ];

    const categories = categoriesId.map((categoryId) => {
      return {
        categoryId,
        newses: sortedPresses.filter(
          (press) => press.category_id === categoryId
        ),
      };
    });

    const idx = 0;

    this.setState({
      idx,
      categories,
      sortedPresses,
    });
  }

  setEvent() {
    this.addEvent("click", ".news-list__list", ({ target }) => {
      if (!target.closest(".button")) return;

      const { idx, sortedPresses } = this.state;
      const direction = target.closest(".button--left") ? LEFT : RIGHT;
      this.setState({
        idx: (idx + direction + sortedPresses.length) % sortedPresses.length,
      });
    });
  }

  template() {
    return `
        <div class="news-list__list">
            <div class="button button--left"></div>
            <div class="button button--right"></div>
            <div class="tab-container"></div>
            <div class="news-content"></div>
        </div>
    `;
  }

  renderChildComponents() {
    const leftButton = this.parentElement.querySelector(".button--left");
    new LeftButton(leftButton);

    const rightButton = this.parentElement.querySelector(".button--right");
    new RightButton(rightButton);

    const { idx, categories, sortedPresses } = this.state;
    const { subscribingPresses } = this.props;

    const press = sortedPresses[idx];

    const tabContainer = this.parentElement.querySelector(".tab-container");
    new Tab(tabContainer);

    const newsContent = this.parentElement.querySelector(".news-content");
    new NewsContent(newsContent, { press, subscribingPresses });
  }
}
