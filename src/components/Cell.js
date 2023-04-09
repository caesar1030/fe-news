import Component from "../core/Component.js";

export default class Cell extends Component {
  template() {
    const src = this.props?.src;
    const name = this.props?.name;
    return `
    <img class="news-list__image" ${src ? `src=${src}` : ""} ${
      name ? `data-name=${name}` : ""
    } />
    <div class="subscribe hidden">
      <button class="subscribe__button">${
        this.state.isSubscribing ? "해지하기" : "구독하기"
      }</button>
    </div>`;
  }

  setup() {
    const { name, subscribingPresses } = this.props;

    const isSubscribing = subscribingPresses?.some(
      (subscribingPress) => subscribingPress === name
    );
    this.state = {
      isSubscribing,
    };
  }

  setEvent() {
    const toggleHidden = ({ target }) => {
      const subscribe = target
        .closest(".news-list__item")
        .querySelector(".subscribe");

      subscribe?.classList.toggle("hidden");
    };
    this.addEvent("mouseenter", ".news-list__item", toggleHidden);

    this.addEvent("mouseleave", ".news-list__item", toggleHidden);

    const { addSubscribing, removeSubscribing } = this.props;
    this.addEvent("click", ".subscribe", ({ target, currentTarget }) => {
      if (!target.closest(".subscribe__button")) return;

      const { name } = currentTarget.querySelector(".news-list__image").dataset;
      this.state.isSubscribing ? removeSubscribing(name) : addSubscribing(name);
      this.setState({
        isSubscribing: !this.state.isSubscribing,
      });
    });
  }
}
