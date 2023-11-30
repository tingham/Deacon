
type InlineGetter = (this: any) => any
type InlineSetter = (this: any, value: any) => void
export class SerializingField {
  public name?: string;
  public databaseType?: string;
  public logicalType?: new (...args: any[]) => any;
  public getter?: InlineGetter;
  public setter?: InlineSetter;
}
