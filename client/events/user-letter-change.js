/**
 * An event describing a single letter change in the letterbox.
 *
 * An important distinction to make is that *user* letter change events originate from the user, while regular letter
 * change events originate from the server.
 */
class UserLetterChangeEvent extends Event {
  /**
   * Create a user letter change event.
   * @param {number} index changed letter index
   * @param {string} newValue new letter value
   */
  constructor (index, newValue) {
    super(UserLetterChangeEvent.eventName)

    this.index = index
    this.newValue = newValue
  }

  static get eventName () {
    return 'user-letter-change'
  }
}

export default UserLetterChangeEvent
