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
/**
 * 
 * @export
 * @interface Layer
 */
export interface Layer {
    /**
     * The key name of the layer
     * @type {string}
     * @memberof Layer
     */
    key?: string;
    /**
     * The value of the layer encoded as json
     * @type {object}
     * @memberof Layer
     */
    value?: object;
    /**
     * The unique identifier of the thing.
     * @type {string}
     * @memberof Layer
     */
    id?: string;
    /**
     * The name of the thing.
     * @type {string}
     * @memberof Layer
     */
    name?: string;
    /**
     * The description of the thing.
     * @type {string}
     * @memberof Layer
     */
    description?: string;
    /**
     * The date and time the thing was created.
     * @type {Date}
     * @memberof Layer
     */
    created?: Date;
    /**
     * The date and time the thing was last updated.
     * @type {Date}
     * @memberof Layer
     */
    updated?: Date;
    /**
     * The unique identifier of the author of the thing.
     * @type {string}
     * @memberof Layer
     */
    authorid?: string;
}

/**
 * Check if a given object implements the Layer interface.
 */
export function instanceOfLayer(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function LayerFromJSON(json: any): Layer {
    return LayerFromJSONTyped(json, false);
}

export function LayerFromJSONTyped(json: any, ignoreDiscriminator: boolean): Layer {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'key': !exists(json, 'key') ? undefined : json['key'],
        'value': !exists(json, 'value') ? undefined : json['value'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'created': !exists(json, 'created') ? undefined : (new Date(json['created'])),
        'updated': !exists(json, 'updated') ? undefined : (new Date(json['updated'])),
        'authorid': !exists(json, 'authorid') ? undefined : json['authorid'],
    };
}

export function LayerToJSON(value?: Layer | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'key': value.key,
        'value': value.value,
        'id': value.id,
        'name': value.name,
        'description': value.description,
        'created': value.created === undefined ? undefined : (value.created.toISOString()),
        'updated': value.updated === undefined ? undefined : (value.updated.toISOString()),
        'authorid': value.authorid,
    };
}
