// Core Base Entity Class
export { BaseEntity } from './BaseEntity';

// Dedicated Entity Instances
import { AdminSecurity } from './AdminSecurity';
import { AppConfiguration } from './AppConfiguration';
import { Appointment } from './Appointment';
import { AuditLog } from './AuditLog';
import { BudgetCategory } from './BudgetCategory';
import { CalendarEvent } from './CalendarEvent';
import { EmergencyContact } from './EmergencyContact';
import { Families } from './Families';
import { FeatureToggle } from './FeatureToggle';
import { HealthLog } from './HealthLog';
import { Holding } from './Holding';
import { MedicalRecord } from './MedicalRecord';
import { Medication } from './Medication';
import { NetWorthPoint } from './NetWorthPoint';
import { Notification } from './Notification';
import { PackingItem } from './PackingItem';
import { Profile } from './Profile';
import { SessionLog } from './SessionLog';
import { SharedTask } from './SharedTask';
import { Transaction } from './Transaction';
import { TravelDocument } from './TravelDocument';
import { Trip } from './Trip';
import { TripEvent } from './TripEvent';
import { User } from './User';
import { VaultItem } from './VaultItem';

export const entities = {
  AdminSecurity,
  AppConfiguration,
  Appointment,
  AuditLog,
  BudgetCategory,
  CalendarEvent,
  EmergencyContact,
  Families,
  FeatureToggle,
  HealthLog,
  Holding,
  MedicalRecord,
  Medication,
  NetWorthPoint,
  Notification,
  PackingItem,
  Profile,
  SessionLog,
  SharedTask,
  Transaction,
  TravelDocument,
  Trip,
  TripEvent,
  User,
  VaultItem,
};

// Re-export named individual entities for flexible direct imports
export {
  AdminSecurity,
  AppConfiguration,
  Appointment,
  AuditLog,
  BudgetCategory,
  CalendarEvent,
  EmergencyContact,
  Families,
  FeatureToggle,
  HealthLog,
  Holding,
  MedicalRecord,
  Medication,
  NetWorthPoint,
  Notification,
  PackingItem,
  Profile,
  SessionLog,
  SharedTask,
  Transaction,
  TravelDocument,
  Trip,
  TripEvent,
  User,
  VaultItem,
};

export default entities;