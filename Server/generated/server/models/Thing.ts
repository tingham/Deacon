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
 * @interface Thing
 */
export interface Thing {
    /**
     * The unique identifier of the thing.
     * @type {string}
     * @memberof Thing
     */
    id?: string;
    /**
     * The name of the thing.
     * @type {string}
     * @memberof Thing
     */
    name?: string;
    /**
     * The description of the thing.
     * @type {string}
     * @memberof Thing
     */
    description?: string;
    /**
     * The date and time the thing was created.
     * @type {Date}
     * @memberof Thing
     */
    created?: Date;
    /**
     * The date and time the thing was last updated.
     * @type {Date}
     * @memberof Thing
     */
    updated?: Date;
    /**
     * The unique identifier of the author of the thing.
     * @type {string}
     * @memberof Thing
     */
    authorid?: string;
}

/**
 * Check if a given object implements the Thing interface.
 */
export function instanceOfThing(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ThingFromJSON(json: any): Thing {
    return ThingFromJSONTyped(json, false);
}

export function ThingFromJSONTyped(json: any, ignoreDiscriminator: boolean): Thing {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'created': !exists(json, 'created') ? undefined : (new Date(json['created'])),
        'updated': !exists(json, 'updated') ? undefined : (new Date(json['updated'])),
        'authorid': !exists(json, 'authorid') ? undefined : json['authorid'],
    };
}

export function ThingToJSON(value?: Thing | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'description': value.description,
        'created': value.created === undefined ? undefined : (value.created.toISOString()),
        'updated': value.updated === undefined ? undefined : (value.updated.toISOString()),
        'authorid': value.authorid,
    };
}

