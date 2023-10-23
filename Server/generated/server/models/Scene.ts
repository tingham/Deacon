/* tslint:disable */
/* eslint-disable */
/**
 * Deacon
 * Deacon API
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { Element } from './Element';
import {
    ElementFromJSON,
    ElementFromJSONTyped,
    ElementToJSON,
} from './Element';

/**
 * 
 * @export
 * @interface Scene
 */
export interface Scene {
    /**
     * 
     * @type {Array<Element>}
     * @memberof Scene
     */
    elements?: Array<Element>;
}

/**
 * Check if a given object implements the Scene interface.
 */
export function instanceOfScene(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function SceneFromJSON(json: any): Scene {
    return SceneFromJSONTyped(json, false);
}

export function SceneFromJSONTyped(json: any, ignoreDiscriminator: boolean): Scene {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'elements': !exists(json, 'elements') ? undefined : ((json['elements'] as Array<any>).map(ElementFromJSON)),
    };
}

export function SceneToJSON(value?: Scene | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'elements': value.elements === undefined ? undefined : ((value.elements as Array<any>).map(ElementToJSON)),
    };
}
