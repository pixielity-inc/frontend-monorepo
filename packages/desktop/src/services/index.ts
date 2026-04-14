// Core
export { DesktopManager } from './desktop-manager.service';
export { MenuRegistry } from './menu-registry.service';
export type { SerializedMenu, SerializedMenuItem } from './menu-registry.service';

// POS Hardware
export { PrinterService } from './printer.service';
export { EscPosFormatter } from './escpos-formatter.service';
export { CashDrawerService } from './cash-drawer.service';
export { ScannerService } from './scanner.service';
export { ScaleService } from './scale.service';
export { DisplayService } from './display.service';

// Permissions
export { PermissionService } from './permission.service';

// Offline & Sync
export { OfflineService } from './offline.service';
export { SyncService } from './sync.service';

// Window & Shell
export { WindowService } from './window.service';
export { TrayService } from './tray.service';
export { DockService } from './dock.service';

// Auto-Update
export { AutoUpdateService } from './auto-update.service';

// Security
export { AuthNativeService } from './auth-native.service';
export { KeychainService } from './keychain.service';
export { LockService } from './lock.service';

// System Integration
export { ClipboardService } from './clipboard.service';
export { FileSystemService } from './file-system.service';
export { ProtocolService } from './protocol.service';
export { PowerService } from './power.service';
export { NotificationService } from './notification.service';

// Updates & Diagnostics
export { CrashReporterService } from './crash-reporter.service';
export { DiagnosticsService } from './diagnostics.service';
