/*
  The MIT License (MIT)

  Copyright (c) 2013 Roman Shtylman

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const brackets = /(\[[^\[\]]*\])/g
const onlyDigits = /^\d+$/

/**
 * @param  {Array} fields
 * @return {Object}
 */
function serialize(fields) {
  let result = {}

  for (let i = 0; i < fields.length; ++i) {
    let field = fields[i]

    let key = field.name
    let val = field.value

    result = hashSerializer(result, key, val)
  }

  return result
}

/**
 * @param  {String} string
 * @return {Array}
 */
function parseKeys(string) {
  let keys = []
  let prefix = /^([^\[\]]*)/
  let children = new RegExp(brackets)
  let match = prefix.exec(string)

  if (match[1]) {
    keys.push(match[1])
  }

  while ((match = children.exec(string)) !== null) {
    keys.push(match[1])
  }

  return keys
}

/**
 * @param {Array} result
 * @param {Array} keys
 * @param {String} value
 */
function hashAssign(result, keys, value) {
  if (keys.length === 0) {
    result = value
    return result
  }

  let key = keys.shift()
  let between = key.match(/^\[(.+?)\]$/)

  if (key === '[]') {
    result = result || []

    if (Array.isArray(result)) {
      result.push(hashAssign(null, keys, value))
    }

    else {
      result._values = result._values || []
      result._values.push(hashAssign(null, keys, value))
    }

    return result
  }

  if (!between) {
    result[key] = hashAssign(result[key], keys, value)
  }

  else {
    let string = between[1]

    if (onlyDigits.test(string)) {
      let index = parseInt(string, 10)
      result = result || [];
      result[index] = hashAssign(result[index], keys, value)
    }

    else {
      result = result || {}
      result[string] = hashAssign(result[string], keys, value)
    }
  }

  return result
}

/**
 * @param  {Array} result
 * @param  {String} key
 * @param  {String} value
 * @return {Object}
 */
function hashSerializer(result, key, value) {
  let matches = key.match(brackets)

  if (matches) {
    let keys = parseKeys(key)
    hashAssign(result, keys, value)
  }

  else {
    let existing = result[key]

    if (existing) {
      if (!Array.isArray(existing)) {
        result[key] = [existing]
      }

      result[key].push(value)
    }

    else {
      result[key] = value
    }
  }

  return result
}

export default serialize
