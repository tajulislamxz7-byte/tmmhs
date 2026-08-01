// ================================================
// PRINCIPAL MANAGEMENT UTILITIES
// Handles principal role validation, activity logging
// ================================================

import { api } from './api.js';

/**
 * Check if there is already an active principal in the system
 * @returns {Promise<Object|null>} Principal user object or null
 */
export async function getActivePrincipal() {
  const users = await api.getUsers();
  return users.find(u => u.role === 'principal' && u.status === 'active') || null;
}

/**
 * Validate if a new principal can be created
 * Only one active principal allowed at a time
 * @returns {Promise<{allowed: boolean, message: string}>}
 */
export async function canCreatePrincipal() {
  const existingPrincipal = await getActivePrincipal();
  
  if (existingPrincipal) {
    return {
      allowed: false,
      message: `A principal already exists: ${existingPrincipal.name} (${existingPrincipal.id}). Please demote them first.`
    };
  }
  
  return { allowed: true, message: 'Can create principal' };
}

/**
 * Log an activity for principal account management
 * @param {string} userId - Principal user ID
 * @param {string} action - Action type (created, promoted, demoted, activated, deactivated, etc.)
 * @param {string} performedBy - User ID of admin who performed action
 * @param {string} performedByName - Name of admin who performed action
 * @param {Object} details - Additional details about the action
 * @returns {Object} Activity log entry
 */
export function createActivityLog(userId, action, performedBy, performedByName, details = {}) {
  return {
    userId,
    action,
    performedBy,
    performedByName,
    timestamp: new Date().toISOString(),
    details,
  };
}

/**
 * Get principal permissions
 * Principal can view and manage content but cannot manage users/roles
 * @returns {Array<string>} List of permissions
 */
export function getPrincipalPermissions() {
  return [
    'view_home',
    'view_notices',
    'view_events',
    'view_gallery',
    'view_all_students',
    'view_all_teachers',
    'view_all_staff',
    'publish_notices',
    'publish_events',
    'view_reports',
    'view_analytics',
    'approve_content',
    'view_results',
    'view_batches',
  ];
}

/**
 * Principal restrictions
 * Things principal CANNOT do
 * @returns {Array<string>} List of restricted actions
 */
export function getPrincipalRestrictions() {
  return [
    'create_principal',      // Cannot create another principal
    'delete_own_account',    // Cannot delete their own account
    'change_own_role',       // Cannot change their own role
    'manage_users',          // Cannot create/delete/manage user accounts
    'manage_roles',          // Cannot modify role permissions
    'manage_admin_settings', // Cannot access deep system settings
    'promote_to_principal',  // Cannot promote others to principal
  ];
}

/**
 * Check if current user is principal
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function isPrincipal(user) {
  return user && user.role === 'principal' && user.status === 'active';
}

/**
 * Check if user has permission to manage principal accounts
 * Only admins can create/promote/demote principals
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function canManagePrincipal(user) {
  return user && user.role === 'admin' && user.status === 'active';
}
