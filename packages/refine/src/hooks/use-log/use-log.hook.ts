/** @fileoverview useLog hook — audit log operations. @module @abdokouta/react-refine @category Hooks */
import type {
  IAuditLogService,
  AuditLogCreateParams,
  AuditLogGetParams,
  AuditLogUpdateParams,
} from '@/interfaces/audit-log.interface';

let _auditLogService: IAuditLogService | undefined;
export function setAuditLogService(svc: IAuditLogService) {
  _auditLogService = svc;
}

const noopAsync = () => Promise.resolve(undefined);

export function useLog(): {
  log: (params: AuditLogCreateParams) => Promise<any>;
  rename: (params: AuditLogUpdateParams) => Promise<any>;
  getLogs: (params: AuditLogGetParams) => Promise<any>;
} {
  if (!_auditLogService) return { log: noopAsync, rename: noopAsync, getLogs: noopAsync };
  return {
    log: (params) => _auditLogService!.create(params),
    rename: (params) => _auditLogService!.update(params),
    getLogs: (params) => _auditLogService!.get(params),
  };
}
