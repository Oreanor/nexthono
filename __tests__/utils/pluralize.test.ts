import { pluralize, pluralizeUser, pluralizeRequest } from '@/app/lib/utils/pluralize'

describe('pluralize', () => {
  describe('pluralizeUser', () => {
    it('should return singular form for 1', () => {
      expect(pluralizeUser(1)).toBe('user')
    })

    it('should return plural form for 0, 2+', () => {
      expect(pluralizeUser(0)).toBe('users')
      expect(pluralizeUser(2)).toBe('users')
      expect(pluralizeUser(5)).toBe('users')
      expect(pluralizeUser(10)).toBe('users')
      expect(pluralizeUser(100)).toBe('users')
    })
  })

  describe('pluralizeRequest', () => {
    it('should return singular form for 1', () => {
      expect(pluralizeRequest(1)).toBe('request')
    })

    it('should return plural form for 0, 2+', () => {
      expect(pluralizeRequest(0)).toBe('requests')
      expect(pluralizeRequest(2)).toBe('requests')
      expect(pluralizeRequest(5)).toBe('requests')
      expect(pluralizeRequest(10)).toBe('requests')
      expect(pluralizeRequest(100)).toBe('requests')
    })
  })

  describe('generic pluralize', () => {
    it('should work with custom words', () => {
      expect(pluralize(1, 'apple', 'apples')).toBe('apple')
      expect(pluralize(2, 'apple', 'apples')).toBe('apples')
      expect(pluralize(5, 'apple', 'apples')).toBe('apples')
    })
  })
})
