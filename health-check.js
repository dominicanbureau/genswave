#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';

async function healthCheck() {
    try {
        console.log('🏥 Running health check...');
        
        // Check main health endpoint
        const healthResponse = await fetch(`${BASE_URL}/health`, { timeout: 10000 });
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Health check passed:', healthData);
        } else {
            console.log('❌ Health check failed:', healthResponse.status);
            return false;
        }
        
        // Check database connectivity
        const authResponse = await fetch(`${BASE_URL}/api/auth/status`, { timeout: 10000 });
        if (authResponse.ok) {
            console.log('✅ Database connectivity: OK');
        } else {
            console.log('⚠️  Database connectivity: Limited');
        }
        
        // Check upload functionality
        const uploadResponse = await fetch(`${BASE_URL}/api/upload/test`, { timeout: 10000 });
        if (uploadResponse.ok) {
            console.log('✅ Upload system: OK');
        } else {
            console.log('⚠️  Upload system: Limited');
        }
        
        console.log('🎉 Application is healthy and ready!');
        return true;
        
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

// Run health check if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    healthCheck()
        .then(success => process.exit(success ? 0 : 1))
        .catch(() => process.exit(1));
}

export default healthCheck;