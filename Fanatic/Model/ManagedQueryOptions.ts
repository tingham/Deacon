
export class ManagedQueryOptions {
    public Include?: string[];
    public Exclude?: string[];
    public OrderBy?: { [column: string]: "ASC" | "DESC"; }[];
    public Limit?: { Offset: number; Count: number; };
}
