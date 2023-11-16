/** Given a string:
 **/
// Return the string with the first letter capitalized
export function ProperCase(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
// Split the string using the given separator
export function Split(value, separator) {
    return value.split(separator);
}
// Return the string with the first letter lowercased
export function LowercaseFirstLetter(value) {
    return value.charAt(0).toLowerCase() + value.slice(1);
}
// Split the string by ' ' and if the last character of the string is punctuation; capitalize the first letter of the first word, otherwise capitalize the first letter of each word
export function SentenceCase(value) {
    var words = value.split(' ');
    var lastWord = words.pop();
    if (lastWord) {
        if (lastWord.match(/[\.\?\!\:\;]/)) {
            words.push(ProperCase(lastWord));
        }
        else {
            words.push(lastWord);
        }
    }
    return words.map(ProperCase).join(' ');
}
//# sourceMappingURL=String.js.map