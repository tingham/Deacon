
export class ManagedQueryOptions {
    public Include?: string[];
    public Exclude?: string[];
    public OrderBy?: { [column: string]: "ASC" | "DESC"; }[];
    public Limit?: { Offset: number; Count: number; };

  public Append(sql: string): string {
    if (this.Include) {
      // Add join statements...
    }
    if (this.Exclude) {
      // I don't know what this even means...
    }
    if (this.OrderBy) {
      sql = sql + " ORDER BY " + this.OrderBy.map((column) => {
        let key = Object.keys(column)[0];
        let value = column[key];
        return key + " " + value;
      }).join(", ");
    }
    if (this.Limit) {
      sql = sql + " LIMIT " + this.Limit.Offset + ", " + this.Limit.Count;
    }
    return sql;
  }

}
