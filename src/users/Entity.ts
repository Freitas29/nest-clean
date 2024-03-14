export default abstract class Entity<T> {
  protected props: T;

  constructor(props: T) {
    this.props = props;
    Object.freeze(this);
  }

  getProps() {
    return this.props;
  }
}
