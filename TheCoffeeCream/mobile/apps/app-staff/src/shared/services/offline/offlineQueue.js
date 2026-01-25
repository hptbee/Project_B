import { cacheService } from '../cache/cacheService';
import { Logger } from '@thecoffeecream/ui-shared';

const QUEUE_KEY = 'app_offline_orders_queue';

/**
 * Offline Queue - Manages pending orders when the network is unavailable
 */
export const OfflineQueue = {
    /**
     * Add an order request to the queue
     * @param {Object} orderData - The order data to be sent
     */
    addOrder: async (orderData) => {
        const queue = OfflineQueue.getQueue();

        // Check if there is already a pending order with the same ClientOrderId
        const existingIndex = queue.findIndex(item =>
            item.data.ClientOrderId &&
            item.data.ClientOrderId === orderData.ClientOrderId
        );

        if (existingIndex >= 0) {
            // Update existing item
            queue[existingIndex].data = orderData;
            queue[existingIndex].timestamp = Date.now();
            // Keep the same ID and attempts? 
            // Reset attempts because it's a new version of data? 
            // Better to reset attempts to give it a fresh chance
            queue[existingIndex].attempts = 0;

            Logger.info(`[OFFLINE] Updated existing order in queue: ${orderData.ClientOrderId}`);
            localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
            return queue[existingIndex].id;
        }

        const newItem = {
            id: orderData.id || crypto.randomUUID(),
            data: orderData,
            timestamp: Date.now(),
            attempts: 0
        };

        queue.push(newItem);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
        Logger.warn(`[OFFLINE] Order added to queue. Queue size: ${queue.length}`);
        return newItem.id;
    },

    /**
     * Get all pending items in the queue
     */
    getQueue: () => {
        try {
            const stored = localStorage.getItem(QUEUE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse offline queue', e);
            return [];
        }
    },

    /**
     * Remove an item from the queue
     */
    remove: (id) => {
        const queue = OfflineQueue.getQueue().filter(item => item.id !== id);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    },

    /**
     * Process the queue - attempts to sync all pending items
     * @param {Function} syncFn - The function that performs the actual API call
     */
    processQueue: async (syncFn) => {
        const queue = OfflineQueue.getQueue();
        if (queue.length === 0) return;

        Logger.info(`[OFFLINE] Starting sync for ${queue.length} pending orders...`);

        for (const item of queue) {
            try {
                item.attempts++;
                await syncFn(item.data);

                // Success! Remove from queue
                OfflineQueue.remove(item.id);
                Logger.info(`[OFFLINE] Order ${item.id} synced successfully.`);
            } catch (error) {
                Logger.error(`[OFFLINE] Failed to sync order ${item.id} (Attempt ${item.attempts}): ${error.message}`);

                // Update attempts in storage
                const currentQueue = OfflineQueue.getQueue();
                const updatedItem = currentQueue.find(qi => qi.id === item.id);
                if (updatedItem) {
                    updatedItem.attempts = item.attempts;
                    localStorage.setItem(QUEUE_KEY, JSON.stringify(currentQueue));
                }

                // If it's a permanent error (not network), we might want to remove it 
                // but for now we'll keep trying until user clears it or network works.
                if (error.message && !error.message.includes('fetch') && !error.message.includes('timeout')) {
                    // Critical error, stop processing this item for now
                    break;
                }
            }
        }
    },

    /**
     * Clear the entire queue
     */
    clear: () => {
        localStorage.removeItem(QUEUE_KEY);
        Logger.info('[OFFLINE] Offline queue cleared.');
    }
};
