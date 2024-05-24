import { observable, observe } from './observer.js';

export default class Component {
  parentElement;
  state;
  props;
  test;
  constructor(parentElement, props) {
    this.parentElement = parentElement;
    this.props = props;
    this.setup();
    this.setEvent();
    this.componentDidMount();
  }

  setup() {
    this.state = observable(this.initState());
    this.test = (() => {
      this.update();
      this.renderChildComponents();
      this.componentDidUpdate();
    }).bind(this);

    observe(this.test);
  }

  initState() {
    return {};
  }

  setEvent() {}

  template() {
    return '';
  }

  render() {
    this.parentElement.innerHTML = this.template();
  }

  update() {
    this.parentElement.innerHTML = this.template();
  }

  componentDidMount() {}

  componentDidUpdate() {}

  renderChildComponents() {}

  setState(newState) {
    for (const [key, value] of Object.entries(newState)) {
      if (!this.state.hasOwnProperty(key)) continue;

      this.state[key] = value;
    }
  }

  addEvent(eventType, selector, callback) {
    this.parentElement.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    });
  }
}
