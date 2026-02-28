/**
 * React.use() Polyfill for React 18
 * 
 * Next.js 14.2.x App Router calls React.use() internally in app-index.js (line 111).
 * React.use() is a React 19 API that doesn't exist in React 18.
 * This polyfill bridges the gap by implementing the Thenable/Promise suspension
 * pattern that React.use() provides.
 * 
 * Based on React RFC: https://github.com/reactjs/rfcs/pull/229
 */

const React = require('react');

if (typeof React.use !== 'function') {
    // Minimal polyfill for React.use()
    // This handles Promise and Context objects
    React.use = function use(usable) {
        // Handle React Context
        if (usable !== null && typeof usable === 'object' && typeof usable.$$typeof === 'symbol') {
            const symbolString = usable.$$typeof.toString();
            if (symbolString === 'Symbol(react.context)' || symbolString === 'Symbol(react.server_context)') {
                // For context, just return the current value
                // This is a simplified version - in React 19 it reads from the fiber stack
                return usable._currentValue;
            }
        }

        // Handle Thenable/Promise (the main use case for Next.js SSR hydration)
        if (usable !== null && typeof usable === 'object' && typeof usable.then === 'function') {
            const thenable = usable;

            // Check the status of the thenable (React's internal protocol)
            switch (thenable.status) {
                case 'fulfilled':
                    return thenable.value;
                case 'rejected':
                    throw thenable.reason;
                default:
                    // Pending - need to suspend
                    if (typeof thenable.status === 'string') {
                        // Already instrumented, just throw to suspend
                        throw thenable;
                    }

                    // Instrument the thenable
                    const pendingThenable = thenable;
                    pendingThenable.status = 'pending';
                    pendingThenable.then(
                        function (value) {
                            if (pendingThenable.status === 'pending') {
                                pendingThenable.status = 'fulfilled';
                                pendingThenable.value = value;
                            }
                        },
                        function (reason) {
                            if (pendingThenable.status === 'pending') {
                                pendingThenable.status = 'rejected';
                                pendingThenable.reason = reason;
                            }
                        }
                    );

                    // Check if it resolved synchronously
                    switch (pendingThenable.status) {
                        case 'fulfilled':
                            return pendingThenable.value;
                        case 'rejected':
                            throw pendingThenable.reason;
                    }

                    // Throw to suspend rendering
                    throw pendingThenable;
            }
        }

        // Fallback: return the value directly
        return usable;
    };
}
