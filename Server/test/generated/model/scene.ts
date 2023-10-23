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
import { Element } from './element';

export class Scene {
    'elements'?: Array<Element>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "elements",
            "baseName": "elements",
            "type": "Array<Element>"
        }    ];

    static getAttributeTypeMap() {
        return Scene.attributeTypeMap;
    }
}
