const express = require('express');
const permissionController = require('../controllers/permission');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /permission/permissions
router.get('/permissions', isAuth, permissionController.getPermissions);

// GET /permission/permissions/:roleId
router.get('/permissions/:roleId', isAuth, permissionController.getPermissionsByRole);

// POST /permission/permission
router.post('/permission', isAuth, permissionController.createPermission);

// GET /permission/permission/:permissionId
router.get('/permission/:permissionId', permissionController.getPermission);

module.exports = router;