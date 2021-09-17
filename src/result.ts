export interface IResult<TKind extends string> {
  readonly kind: TKind;
}

export interface IResultWithValue<TKind extends string, TValue>
  extends IResult<TKind> {
  readonly value: TValue;
}

export class Ok<TValue> implements IResultWithValue<"ok", TValue> {
  readonly kind = "ok";

  constructor(readonly value: TValue) {}
}

export class Created<TValue> implements IResultWithValue<"created", TValue> {
  readonly kind = "created";

  constructor(readonly value: TValue) {}
}

export class NoContent implements IResult<"no-content"> {
  readonly kind = "no-content";
}

export class NotFound implements IResult<"not-found"> {
  readonly kind = "not-found";
}

export class Conflict implements IResult<"conflict"> {
  readonly kind = "conflict";
}
