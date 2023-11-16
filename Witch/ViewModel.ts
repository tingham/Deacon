/**
 * @abstract ViewModel
 * A common class for the main types of view models.
 **/

import { Action } from "./Action";

export abstract class ViewModel {

  // Convenience storage for the title, description, plural name and singular name of the view.
  protected title: string | undefined;
  protected description: string | undefined;
  protected pluralName: string | undefined;
  protected singularName: string | undefined;

  // Optional title for the view.
  public abstract get Title(): string | undefined;

  // Optional description for the view.
  public abstract get Description(): string | undefined;

  public abstract get PluralName(): string | undefined;
  public abstract get SingularName(): string | undefined;

  // Because the action is business-logic critical there is no default implementation or convenience storage
  public abstract get AddAction(): Action | undefined;

  // Helpers that we will automatically Adopt during rendering
  public Helpers: Array<string> = []
}
