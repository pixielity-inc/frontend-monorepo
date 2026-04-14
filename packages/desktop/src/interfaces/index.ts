// Core
export type { DesktopModuleOptions } from './desktop-module-options.interface';
export type { DesktopBridge } from './desktop-bridge.interface';
export type { MenuItemOptions, MenuMetadata, MenuItemMetadata } from './menu-item.interface';

// POS Hardware
export type {
  PrinterConfig,
  PrinterInfo,
  ReceiptData,
  ReceiptItem,
  CashDrawerConfig,
  ScannerConfig,
  ScaleConfig,
  ScaleReading,
  DisplayConfig,
  DisplayInfo,
} from './hardware.interface';

// Offline & Sync
export type { QueuedOperation, OfflineConfig, SyncConfig, SyncProgress } from './offline.interface';

// Window & Shell
export type {
  ChildWindowOptions,
  WindowInfo,
  TrayOptions,
  TrayMenuTemplate,
  TrayMenuItemOptions,
} from './window.interface';

// Security
export type { BiometricResult, LockConfig } from './security.interface';

// System Integration
export type {
  FileDialogOptions,
  FileResult,
  ParsedProtocolUrl,
  NotificationOptions,
  DeviceType,
  PermissionState,
} from './system.interface';
export type { PowerState } from './system.interface';

// Diagnostics & Crash Reporting
export type {
  SystemInfo,
  MemoryUsage,
  GpuInfo,
  NetworkStatus,
  CrashReporterConfig,
} from './diagnostics.interface';

// Auto-Update
export type { UpdateEvent, UpdateInfo } from './update.interface';
