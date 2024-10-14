export const updateMemoryUsage = (memory, memoryCounter) => {
    if (performance.memory) {
        const usedJSHeapSize = performance.memory.usedJSHeapSize;
        memoryCounter.textContent = `Memory: ${(usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`;
    } else {
        const bytes = memory.buffer.byteLength;
        const mb = bytes / (1024 * 1024);
        memoryCounter.textContent = `Memory: ${mb.toFixed(2)} MB`;
    }
};
