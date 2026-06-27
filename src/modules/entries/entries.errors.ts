import { NotFoundError } from "../../lib/errors.ts";

export class EntryNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Entry ${id} tidak ditemukan`);
  }
}
