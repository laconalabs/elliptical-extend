/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'

export default function createProcess (extensions) {
  return function process (element) {
    // you can't extend builtins or element without describe
    if (_.isString(element) || !element.type.describe) return element

    const theseExtensions = _.chain(extensions)
      .filter(Extension => _.includes(Extension.extends, element.type))
      .map(Extension => (
        <Extension {...element.props} id={undefined}>
          {element.children}
        </Extension>
      ))
      .value()

    if (theseExtensions.length) {
      function newDescribe (model) {
        return (
          <choice>
            {element.type.describe(model)}
            {theseExtensions}
          </choice>
        )
      }
      const newPhrase = _.assign({}, element.type, {describe: newDescribe})
      return _.assign({}, element, {type: newPhrase})
    } else {
      return element
    }
  }
}