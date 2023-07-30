export class Page<T> {
  public readonly pageCount: number = Math.ceil(this.total / this.perPage);

  constructor(
    public readonly data: T[],
    public readonly total: number,
    public readonly page: number,
    public readonly perPage: number,
  ) {}
}
