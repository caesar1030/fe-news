import Component from '../../../core/Component.js';
import LeftButton from '../button/LeftButton.js';
import RightButton from '../button/RightButton.js';
import NewsContent from './NewsContent.js';
import AllTab from './AllTab.js';
import SubscriptionTab from './SubscriptionTab.js';
import { setListIdx, store } from '../../../store/store.js';

const LEFT = -1;
const RIGHT = 1;

export default class ListView extends Component {
  setEvent() {
    const handleButtonClick = ({ target }) => {
      if (!target.closest('.button')) return;

      const {
        listView: { index },
        contents: { presses, subscriptionOption, subscribingPresses },
      } = store.getState();

      if (!presses.length) return;

      const direction = target.closest('.button--left') ? LEFT : RIGHT;

      const categorizedPresses = presses.sort((a, b) =>
        a.category_id < b.category_id ? -1 : 1
      );

      const selectedPresses =
        subscriptionOption === 'all'
          ? categorizedPresses
          : subscribingPresses?.map((subscribingPressName) =>
              presses.find((press) => press.name === subscribingPressName)
            );

      const nextIndex =
        (index + direction + selectedPresses.length) % selectedPresses.length;

      store.dispatch(setListIdx(nextIndex));
    };

    this.addEvent('click', '.news-list__list', handleButtonClick);
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
    const {
      contents: { subscriptionOption, presses, subscribingPresses },
      listView: { index },
    } = store.getState();

    if (!(subscriptionOption === 'sub' && !subscribingPresses.length)) {
      const leftButton = this.parentElement.querySelector('.button--left');
      this.a = new LeftButton(leftButton);

      const rightButton = this.parentElement.querySelector('.button--right');
      this.b = new RightButton(rightButton);
    }

    const categorizedPresses = presses.sort((a, b) =>
      a.category_id < b.category_id ? -1 : 1
    );
    const categories = [
      ...new Set(categorizedPresses.map((press) => press.category_id)),
    ];

    const selectedPresses =
      subscriptionOption === 'all'
        ? categorizedPresses
        : subscribingPresses?.map((subscribingPressName) =>
            presses.find((press) => press.name === subscribingPressName)
          );

    const selectedPress = selectedPresses[index];

    const selectedCategories = presses.filter(
      (press) => press.category_id === selectedPress?.category_id
    );

    const categoryLength = selectedCategories.length;
    const categoryIndex = selectedCategories.findIndex(
      (press) => press.name === selectedPress?.name
    );

    const tabContainer = this.parentElement.querySelector('.tab-container');
    this.c =
      subscriptionOption === 'all'
        ? new AllTab(tabContainer, {
            selectedPress,
            categoryIndex,
            categoryLength,
            categories,
          })
        : new SubscriptionTab(tabContainer, {
            selectedPress,
          });

    const newsContent = this.parentElement.querySelector('.news-content');
    this.d = new NewsContent(newsContent, { selectedPress });
  }
}
