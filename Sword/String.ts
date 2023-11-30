
/** Given a string:
 **/

// Return the string with the first letter capitalized
export function ProperCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// Split the string using the given separator
export function Split(value: string, separator: string): Array<string> {
  return value.split(separator)
}

// Names
export function NameCase(value: string): string {
  return value.split(' ').map(ProperCase).join(' ')
}

// Return the string with the first letter lowercased
export function LowercaseFirstLetter(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

// Split the string by ' ' and if the last character of the string is punctuation; capitalize the first letter of the first word, otherwise capitalize the first letter of each word
export function SentenceCase (value: string): string {
  let words = value.split(' ')
  let lastWord = words.pop()
  if (lastWord) {
    if (lastWord.match(/[\.\?\!\:\;]/)) {
      words.push(ProperCase(lastWord))
    } else {
      words.push(lastWord)
    }
  }
  return words.map(ProperCase).join(' ')
}
