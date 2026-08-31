import type { ProblemDetails } from "./problem-details";

export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail?: string;
  readonly type?: string;
  readonly instance?: string;
  readonly traceId?: string;
  readonly timestamp?: string;
  readonly problemDetails: ProblemDetails;

  constructor(
    problem: ProblemDetails,
    fallbackMessage = "An unexpected error occurred",
  ) {
    const message = problem.detail || problem.title || fallbackMessage;
    super(message);

    this.name = "ApiError";
    this.status = problem.status ?? 500;
    this.title = problem.title ?? "Error";
    this.detail = problem.detail;
    this.type = problem.type;
    this.instance = problem.instance;
    this.traceId = problem.traceId;
    this.timestamp = problem.timestamp;
    this.problemDetails = problem;

    // Maintains proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
