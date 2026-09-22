import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  tenantId?: string;
  userEmail?: string;
  apiScopes?: string[];
  rawBody?: Buffer;
}

/**
 * Validates or injects default tenant ID for multi-tenant CRM isolation
 */
export function tenantMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const tenantHeader = req.headers['x-tenant-id'] || req.headers['x-clientum-tenant'];
  req.tenantId = (typeof tenantHeader === 'string' && tenantHeader.trim()) ? tenantHeader.trim() : 'clientum-default-tenant';
  next();
}

/**
 * Standard API error handler
 */
export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('🔥 [Server Error Middleware]:', err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR',
  });
}
