import { Router, Response } from 'express';
import { pool, listCrmRecords, upsertCrmRecords, listCrmDuplicates, resolveCrmDuplicate } from '../db';
import { AuthenticatedRequest } from '../middleware/auth';

export const crmRouter = Router();

// GET /api/crm/records
crmRouter.get('/records', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.tenantId || 'clientum-default-tenant';
    const records = await listCrmRecords(pool, tenantId);
    return res.json({
      success: true,
      tenantId,
      records,
    });
  } catch (error: any) {
    console.error('Error fetching CRM records:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch CRM records' });
  }
});

// POST /api/crm/records/sync
crmRouter.post('/records/sync', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.tenantId || 'clientum-default-tenant';
    const payload = req.body || {};
    const count = await upsertCrmRecords(pool, tenantId, payload);
    return res.json({
      success: true,
      tenantId,
      upsertedCount: count,
    });
  } catch (error: any) {
    console.error('Error syncing CRM records:', error);
    return res.status(500).json({ error: error.message || 'Failed to sync CRM records' });
  }
});

// GET /api/crm/duplicates
crmRouter.get('/duplicates', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.tenantId || 'clientum-default-tenant';
    const duplicates = await listCrmDuplicates(pool, tenantId);
    return res.json({
      success: true,
      tenantId,
      duplicates,
    });
  } catch (error: any) {
    console.error('Error listing duplicates:', error);
    return res.status(500).json({ error: error.message || 'Failed to list duplicates' });
  }
});

// POST /api/crm/duplicates/resolve
crmRouter.post('/duplicates/resolve', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.tenantId || 'clientum-default-tenant';
    const { duplicateId, resolution } = req.body || {};
    if (!duplicateId) {
      return res.status(400).json({ error: 'duplicateId is required' });
    }
    const result = await resolveCrmDuplicate(pool, tenantId, duplicateId, resolution || 'merge');
    return res.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('Error resolving duplicate:', error);
    return res.status(500).json({ error: error.message || 'Failed to resolve duplicate' });
  }
});
