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
 * @interface Geometry
 */
export interface Geometry {
    /**
     * The unique identifier of the thing.
     * @type {string}
     * @memberof Geometry
     */
    id?: string;
    /**
     * The name of the thing.
     * @type {string}
     * @memberof Geometry
     */
    name?: string;
    /**
     * The description of the thing.
     * @type {string}
     * @memberof Geometry
     */
    description?: string;
    /**
     * The date and time the thing was created.
     * @type {Date}
     * @memberof Geometry
     */
    created?: Date;
    /**
     * The date and time the thing was last updated.
     * @type {Date}
     * @memberof Geometry
     */
    updated?: Date;
    /**
     * The unique identifier of the author of the thing.
     * @type {string}
     * @memberof Geometry
     */
    authorid?: string;
}

/**
 * Check if a given object implements the Geometry interface.
 */
export function instanceOfGeometry(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function GeometryFromJSON(json: any): Geometry {
    return GeometryFromJSONTyped(json, false);
}

export function GeometryFromJSONTyped(json: any, ignoreDiscriminator: boolean): Geometry {
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

export function GeometryToJSON(value?: Geometry | null): any {
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

