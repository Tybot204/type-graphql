import TypedPropertyDecorator from "@src/interfaces/TypedPropertyDecorator";
import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";
import {
  parseDecoratorParameters,
  parseStringOrSymbol,
} from "@src/decorators/helpers";
import {
  Nameable,
  Descriptionable,
  Nullable,
  ExplicitTypeable,
} from "@src/decorators/types";
import ClassType from "@src/interfaces/ClassType";

export interface FieldOptions
  extends Nameable,
    Descriptionable,
    Nullable,
    ExplicitTypeable {}

/**
 * Decorator used to register the class property
 * as an field of ObjectType or InputType in GraphQL schema, e.g.:
 *
 * ```graphql
 * type MyClass {
 *  myProperty: SomeType!
 * }
 * ```
 */
export default function Field(options?: FieldOptions): TypedPropertyDecorator;
export default function Field(
  /**
   * Function that returns an explicit type to overwrite
   * or enhance the built-in TypeScript type reflection system,
   * e.g. `@Field(type => [String])`
   */
  explicitTypeFn: ExplicitTypeFn,
  options?: FieldOptions,
): TypedPropertyDecorator;
export default function Field(
  maybeExplicitTypeFnOrOptions?: ExplicitTypeFn | FieldOptions,
  maybeOptions?: FieldOptions,
): TypedPropertyDecorator {
  return (prototype, propertyKey) => {
    const target = prototype.constructor as ClassType; // FIXME: fix typed decorator signature
    const { explicitTypeFn, options = {} } = parseDecoratorParameters(
      maybeExplicitTypeFnOrOptions,
      maybeOptions,
      {
        target,
        propertyKey,
      },
    );
    MetadataStorage.get().collectFieldMetadata({
      target,
      propertyKey,
      schemaName: options.schemaName ?? parseStringOrSymbol(propertyKey),
      description: options.description,
      nullable: options.nullable,
      explicitTypeFn,
    });
  };
}