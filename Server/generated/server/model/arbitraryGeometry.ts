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

import { RequestFile } from './models';

export class ArbitraryGeometry {
    /**
    * The vertices of the geometry.
    */
    'vertices'?: Array<number>;
    /**
    * The normals of the geometry.
    */
    'normals'?: Array<number>;
    /**
    * The uvs of the geometry.
    */
    'uvs'?: Array<number>;
    /**
    * The indices of the geometry.
    */
    'indices'?: Array<number>;
    /**
    * The unique identifier of the thing.
    */
    'id'?: string;
    /**
    * The name of the thing.
    */
    'name'?: string;
    /**
    * The description of the thing.
    */
    'description'?: string;
    /**
    * The date and time the thing was created.
    */
    'created'?: Date;
    /**
    * The date and time the thing was last updated.
    */
    'updated'?: Date;
    /**
    * The unique identifier of the author of the thing.
    */
    'authorid'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "vertices",
            "baseName": "vertices",
            "type": "Array<number>"
        },
        {
            "name": "normals",
            "baseName": "normals",
            "type": "Array<number>"
        },
        {
            "name": "uvs",
            "baseName": "uvs",
            "type": "Array<number>"
        },
        {
            "name": "indices",
            "baseName": "indices",
            "type": "Array<number>"
        },
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "description",
            "baseName": "description",
            "type": "string"
        },
        {
            "name": "created",
            "baseName": "created",
            "type": "Date"
        },
        {
            "name": "updated",
            "baseName": "updated",
            "type": "Date"
        },
        {
            "name": "authorid",
            "baseName": "authorid",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return ArbitraryGeometry.attributeTypeMap;
    }
}

