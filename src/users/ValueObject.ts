type valueObjetProps = {
  [index: string]: unknown;
};

export default abstract class ValueObject<T extends valueObjetProps> {
  props: T;

  constructor(data: T) {
    this.props = data;
  }
}
