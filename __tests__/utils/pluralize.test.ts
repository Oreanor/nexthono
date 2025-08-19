import { pluralize, pluralizeUser, pluralizeRequest } from '@/app/lib/utils/pluralize'

describe('pluralize', () => {
  describe('pluralizeUser', () => {
    it('should return correct form for 1', () => {
      expect(pluralizeUser(1)).toBe('пользователь')
    })

    it('should return correct form for 2-4', () => {
      expect(pluralizeUser(2)).toBe('пользователя')
      expect(pluralizeUser(3)).toBe('пользователя')
      expect(pluralizeUser(4)).toBe('пользователя')
    })

    it('should return correct form for 5-20', () => {
      expect(pluralizeUser(5)).toBe('пользователей')
      expect(pluralizeUser(10)).toBe('пользователей')
      expect(pluralizeUser(20)).toBe('пользователей')
    })

    it('should return correct form for 21-24', () => {
      expect(pluralizeUser(21)).toBe('пользователь')
      expect(pluralizeUser(22)).toBe('пользователя')
      expect(pluralizeUser(23)).toBe('пользователя')
      expect(pluralizeUser(24)).toBe('пользователя')
    })

    it('should return correct form for 25+', () => {
      expect(pluralizeUser(25)).toBe('пользователей')
      expect(pluralizeUser(100)).toBe('пользователей')
    })

    it('should handle 11-19 correctly', () => {
      expect(pluralizeUser(11)).toBe('пользователей')
      expect(pluralizeUser(12)).toBe('пользователей')
      expect(pluralizeUser(19)).toBe('пользователей')
    })
  })

  describe('pluralizeRequest', () => {
    it('should return correct form for 1', () => {
      expect(pluralizeRequest(1)).toBe('запрос')
    })

    it('should return correct form for 2-4', () => {
      expect(pluralizeRequest(2)).toBe('запроса')
      expect(pluralizeRequest(3)).toBe('запроса')
      expect(pluralizeRequest(4)).toBe('запроса')
    })

    it('should return correct form for 5+', () => {
      expect(pluralizeRequest(5)).toBe('запросов')
      expect(pluralizeRequest(10)).toBe('запросов')
      expect(pluralizeRequest(100)).toBe('запросов')
    })
  })

  describe('generic pluralize', () => {
    it('should work with custom words', () => {
      expect(pluralize(1, 'яблоко', 'яблока', 'яблок')).toBe('яблоко')
      expect(pluralize(2, 'яблоко', 'яблока', 'яблок')).toBe('яблока')
      expect(pluralize(5, 'яблоко', 'яблока', 'яблок')).toBe('яблок')
    })
  })
})
