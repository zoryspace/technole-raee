import { z } from "zod";

const toValidationDetails = (issues) =>
  issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));

export const validate = ({ body, params, query }) => (req, _res, next) => {
  const issues = [];

  if (body) {
    const parsedBody = body.safeParse(req.body);
    if (!parsedBody.success) {
      issues.push(
        ...parsedBody.error.issues.map((issue) => ({
          ...issue,
          path: ["body", ...issue.path],
        }))
      );
    } else {
      req.body = parsedBody.data;
    }
  }

  if (params) {
    const parsedParams = params.safeParse(req.params);
    if (!parsedParams.success) {
      issues.push(
        ...parsedParams.error.issues.map((issue) => ({
          ...issue,
          path: ["params", ...issue.path],
        }))
      );
    } else {
      req.params = parsedParams.data;
    }
  }

  if (query) {
    const parsedQuery = query.safeParse(req.query);
    if (!parsedQuery.success) {
      issues.push(
        ...parsedQuery.error.issues.map((issue) => ({
          ...issue,
          path: ["query", ...issue.path],
        }))
      );
    } else {
      req.query = parsedQuery.data;
    }
  }

  if (issues.length > 0) {
    return next({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid request data",
      details: toValidationDetails(issues),
    });
  }

  return next();
};

export const emptyObjectSchema = z.object({}).strict();
