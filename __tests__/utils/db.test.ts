import { ensureDbInitialized } from '@/app/lib/utils/db'

describe('Database Utils', () => {
  describe('ensureDbInitialized', () => {
    it('should be a function', () => {
      expect(typeof ensureDbInitialized).toBe('function')
    })

    it('should return a promise', () => {
      const result = ensureDbInitialized()
      expect(result).toBeInstanceOf(Promise)
    })
  })
})
