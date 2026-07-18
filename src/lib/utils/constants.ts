export const APP_NAME = 'AssetPilot';
export const APP_TAGLINE = 'Enterprise Asset Lifecycle Management System';

export const USER_ROLES = {
  ADMINISTRATOR: 'administrator',
  WAREHOUSE: 'warehouse',
  TECHNICIAN: 'technician',
  SUPERVISOR: 'supervisor',
  MANAGEMENT: 'management',
} as const;

export const ASSET_TYPES = {
  EDC: 'edc', SIM_CARD: 'sim_card', SAM_CARD: 'sam_card',
  BATTERY: 'battery', ADAPTER: 'adapter', PRINTER: 'printer',
  SCANNER: 'scanner', OTHER_DEVICE: 'other_device',
} as const;

export const ASSET_STATUS = {
  READY_STOCK: 'ready_stock', DEPLOYED: 'deployed', ON_TECHNICIAN: 'on_technician',
  IN_TRANSIT: 'in_transit', IN_QC: 'in_qc', IN_REPAIR: 'in_repair',
  SCRAP: 'scrap', LOST: 'lost', RETURNED: 'returned',
} as const;

export const ASSET_CONDITION = {
  GOOD: 'good', MINOR_DAMAGE: 'minor_damage', MAJOR_DAMAGE: 'major_damage',
  BROKEN: 'broken', REPAIR_REQUIRED: 'repair_required', SCRAP: 'scrap',
} as const;

export const WORK_ORDER_STATUS = {
  PENDING: 'pending', ASSIGNED: 'assigned', IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed', CANCELLED: 'cancelled', ON_HOLD: 'on_hold',
} as const;
