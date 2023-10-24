# DefaultApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getDocument**](DefaultApi.md#getDocument) | **GET** /document/{id} |  |
| [**updateDocument**](DefaultApi.md#updateDocument) | **POST** /document/{id} |  |


<a name="getDocument"></a>
# **getDocument**
> Document getDocument(id)



    Get document

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The unique identifier of the document. | [default to null] |

### Return type

[**Document**](../Models/Document.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateDocument"></a>
# **updateDocument**
> Document updateDocument(id, Document)



    Update document

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The unique identifier of the document. | [default to null] |
| **Document** | [**Document**](../Models/Document.md)| The document to update. | |

### Return type

[**Document**](../Models/Document.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

