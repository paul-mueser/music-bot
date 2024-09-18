import type { IReelItemWatchRequest, ReelItemWatchEndpointOptions } from '../../../types/index.js';
export declare const PATH = "/reel/reel_item_watch";
/**
 * Builds a `/reel/reel_watch_sequence` request payload.
 * @param opts - The options to use.
 * @returns The payload.
 */
export declare function build(opts: ReelItemWatchEndpointOptions): IReelItemWatchRequest;
